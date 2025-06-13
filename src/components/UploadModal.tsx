
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: string;
  onUpload: (file: File) => Promise<void>;
  isLoading: boolean;
}

export function UploadModal({ isOpen, onClose, platform, onUpload, isLoading }: UploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select an image file.',
          variant: 'destructive',
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: 'File too large',
          description: 'Please select an image smaller than 5MB.',
          variant: 'destructive',
        });
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      await onUpload(selectedFile);
      handleClose();
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Verify {platform} Follow
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Please upload a screenshot showing that you've followed our official {platform} page.
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="screenshot">Screenshot</Label>
            <Input
              id="screenshot"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={isLoading}
            />
          </div>

          {previewUrl && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="relative border rounded-lg overflow-hidden">
                <img 
                  src={previewUrl} 
                  alt="Screenshot preview" 
                  className="w-full h-48 object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl('');
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={!selectedFile || isLoading}
            >
              {isLoading ? 'Verifying...' : 'Submit & Verify'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
