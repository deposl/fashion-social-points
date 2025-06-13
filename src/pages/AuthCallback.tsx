
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const dataParam = queryParams.get('data');

    if (dataParam) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(dataParam));

        if (window.opener) {
          // Send message to the parent window with the current domain
          window.opener.postMessage(decodedData, window.location.origin);
          window.close();
        } else {
          console.warn('Auth callback window was not opened by a parent window.');
          navigate('/'); // Navigate to home page as fallback
        }
      } catch (e) {
        console.error("Error parsing auth callback data:", e);
        if (window.opener) {
            window.opener.postMessage({ status: 'error', message: 'Authentication data processing error.' }, window.location.origin);
            window.close();
        } else {
            navigate('/?error=auth_data_parse_error');
        }
      }
    } else {
      console.warn('No authentication data found in the callback URL.');
      if (window.opener) {
          window.opener.postMessage({ status: 'error', message: 'No authentication data received.' }, window.location.origin);
          window.close();
      } else {
          navigate('/?error=no_auth_data');
      }
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Authentication process complete. Please wait, closing window...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
