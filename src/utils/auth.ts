
export function generateUniqueToken() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Helper function to get current domain
function getCurrentDomain(): string {
  return window.location.origin;
}

export function openAuthPopup(): Promise<{name: string, email: string} | null> {
  return new Promise((resolve) => {
    console.log('Button clicked');
    const token = generateUniqueToken();
    const currentDomain = getCurrentDomain();
    console.log('Token:', token);
    console.log('Current domain:', currentDomain);
    
    // Include the callback domain in the auth URL
    const authUrl = `https://www.zada.lk/auth-login?token=${token}&callback_domain=${encodeURIComponent(currentDomain)}`; 
    console.log('URL:', authUrl);

    const width = 600;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    const popup = window.open(authUrl, 'authPopup', `width=${width},height=${height},top=${top},left=${left}`);
    if (!popup) {
      console.error('Popup failed to open. Check popup blocker.');
      resolve(null);
      return;
    }

    // Listen for messages from the popup
    const messageListener = (event: MessageEvent) => {
      // Security Check: Verify the origin matches current domain
      if (event.origin !== currentDomain) {
        console.warn('Message received from untrusted origin:', event.origin, 'Expected:', currentDomain);
        return;
      }

      // Check if the message contains our expected data structure
      const { status, message, userData } = event.data;

      if (status === 'success' && userData && Array.isArray(userData) && userData.length > 0) {
        const user = userData[0];

        if (user && user.name && user.email) {
          console.log('User authenticated:', user);

          // Store user in localStorage
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('loginTimestamp', Date.now().toString());

          // Clean up listeners and intervals
          window.removeEventListener('message', messageListener);
          clearInterval(checkPopupClosedInterval); 
          clearTimeout(timeoutId); 

          resolve(user);
          return;
        }
      } else if (status === 'error') {
        console.error('Authentication popup reported an error:', message, event.data);
        window.removeEventListener('message', messageListener);
        clearInterval(checkPopupClosedInterval);
        clearTimeout(timeoutId);
        resolve(null);
      } else {
        console.warn('Received unexpected message from popup:', event.data);
      }
    };

    window.addEventListener('message', messageListener);

    // Poll the popup to check if it's closed
    const checkPopupClosedInterval = setInterval(() => {
      try {
        if (popup.closed) {
          clearInterval(checkPopupClosedInterval);
          window.removeEventListener('message', messageListener);
          clearTimeout(timeoutId);
          console.log('Auth popup closed (either by script or user).');
          resolve(null);
        }
      } catch (e) {
        console.warn('Error checking popup closed status:', e);
        clearInterval(checkPopupClosedInterval);
        window.removeEventListener('message', messageListener);
        clearTimeout(timeoutId);
        resolve(null);
      }
    }, 500);

    // Set a timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      clearInterval(checkPopupClosedInterval);
      window.removeEventListener('message', messageListener);
      if (popup && !popup.closed) {
          popup.close();
          console.warn('Authentication popup timed out and was forcefully closed.');
      }
      resolve(null);
    }, 120000); // 2 minutes timeout
  });
}

export function checkLoginStatus(): Promise<{name: string, email: string} | null> {
  return new Promise((resolve) => {
    const storedUser = localStorage.getItem('user');
    const loginTimestamp = localStorage.getItem('loginTimestamp');

    if (!storedUser || !loginTimestamp) {
      resolve(null);
      return;
    }

    const currentTime = Date.now();
    const oneDayInMs = 24 * 60 * 60 * 1000;
    const shouldCheck = currentTime - parseInt(loginTimestamp) > oneDayInMs;

    if (shouldCheck) {
      const token = generateUniqueToken();
      const currentDomain = getCurrentDomain();
      const authUrl = `https://www.zada.lk/auth-login?token=${token}&callback_domain=${encodeURIComponent(currentDomain)}`;

      const popup = window.open(authUrl, 'authCheckPopup', 'width=1,height=1');
      if (!popup) {
        localStorage.setItem('loginTimestamp', currentTime.toString());
        resolve(JSON.parse(storedUser));
        return;
      }

      const checkRedirectInterval = setInterval(() => {
        try {
          if (popup.location.href.includes('https://www.zada.lk/login')) {
            clearInterval(checkRedirectInterval);
            localStorage.removeItem('user');
            localStorage.removeItem('loginTimestamp');
            popup.close();
            resolve(null);
          } else if (popup.closed) {
            clearInterval(checkRedirectInterval);
            localStorage.setItem('loginTimestamp', currentTime.toString());
            resolve(JSON.parse(storedUser));
          }
        } catch (e) {
          clearInterval(checkRedirectInterval);
          if (popup && !popup.closed) popup.close();
          localStorage.setItem('loginTimestamp', currentTime.toString());
          resolve(JSON.parse(storedUser));
        }
      }, 500);

      setTimeout(() => {
        clearInterval(checkRedirectInterval);
        if (popup && !popup.closed) popup.close();
        localStorage.setItem('loginTimestamp', currentTime.toString());
        resolve(JSON.parse(storedUser));
      }, 5000);
    } else {
      resolve(JSON.parse(storedUser));
    }
  });
}

export function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('loginTimestamp');
}
