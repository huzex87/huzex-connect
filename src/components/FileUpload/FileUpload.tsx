import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, File, Image, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface FileUploadProps {
  bucket: 'delivery-proofs' | 'pickup-proofs' | 'profile-photos' | 'documents';
  path?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  onUploadComplete?: (files: UploadedFile[]) => void;
  className?: string;
}

interface UploadedFile {
  path: string;
  public_url: string;
  size: number;
  type: string;
  name: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  bucket,
  path,
  accept = "image/*",
  multiple = false,
  maxSize = 10,
  onUploadComplete,
  className
}) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (selectedFiles: FileList) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to upload files",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    const uploadedFiles: UploadedFile[] = [];

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        
        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
          toast({
            title: "File too large",
            description: `${file.name} exceeds ${maxSize}MB limit`,
            variant: "destructive",
          });
          continue;
        }

        // Generate unique file path
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = path ? `${path}/${fileName}` : `${user.id}/${fileName}`;

        // Create FormData
        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucket', bucket);
        formData.append('path', filePath);

        // Upload using edge function
        const { data, error } = await supabase.functions.invoke('upload-file', {
          body: formData,
        });

        if (error) {
          console.error('Upload error:', error);
          toast({
            title: "Upload failed",
            description: `Failed to upload ${file.name}`,
            variant: "destructive",
          });
          continue;
        }

        uploadedFiles.push({
          ...data,
          name: file.name,
        });
      }

      setFiles(prev => [...prev, ...uploadedFiles]);
      onUploadComplete?.(uploadedFiles);

      if (uploadedFiles.length > 0) {
        toast({
          title: "Upload successful",
          description: `${uploadedFiles.length} file(s) uploaded successfully`,
        });
      }

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "An error occurred while uploading files",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onUploadComplete?.(newFiles);
  };

  return (
    <div className={className}>
      <Card>
        <CardContent className="p-6">
          <div
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                Max size: {maxSize}MB
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileSelect(e.target.files);
              }
            }}
          />

          {uploading && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Uploading...</span>
            </div>
          )}

          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium">Uploaded Files</h4>
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                  <div className="flex items-center gap-2">
                    {file.type.startsWith('image/') ? (
                      <Image className="h-4 w-4" />
                    ) : (
                      <File className="h-4 w-4" />
                    )}
                    <span className="text-sm">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};