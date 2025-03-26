
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploaderProps {
  foodId: string | null;
  isUploading: boolean;
  onUpload: (file: File) => Promise<void>;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  foodId,
  isUploading,
  onUpload
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileSelection = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent any default form submission
    e.stopPropagation(); // Stop event propagation
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    // Validate file size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    await onUpload(file);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <Button 
        onClick={triggerFileSelection}
        variant="outline"
        disabled={isUploading || !foodId}
        className="flex items-center gap-2"
        type="button"
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            Upload Image
          </>
        )}
      </Button>
    </div>
  );
};

export default ImageUploader;
