'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/ui/icons';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

interface CategoryImageUploadProps {
  categoryId?: string;
  currentImageUrl?: string;
  onImageUploaded: (imageUrl: string) => void;
  onImageDeleted: () => void;
  maxFileSize?: number; // in MB
  acceptedFormats?: string[];
  className?: string;
}

export function CategoryImageUpload({
  categoryId,
  currentImageUrl,
  onImageUploaded,
  onImageDeleted,
  maxFileSize = 5,
  acceptedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  className = ''
}: CategoryImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = (file: File): string | null => {
    if (!acceptedFormats.includes(file.type)) {
      return `Invalid file format. Accepted formats: ${acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')}`;
    }
    
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB`;
    }
    
    return null;
  };

  const handleFileUpload = async (file: File) => {
    if (!categoryId) {
      toast({
        title: 'Error',
        description: 'Cannot upload image without category ID',
        variant: 'destructive',
      });
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      toast({
        title: 'Invalid file',
        description: validationError,
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Import the API function dynamically to avoid circular imports
      const { uploadCategoryImage } = await import('@/lib/api/admin-categories');
      const updatedCategory = await uploadCategoryImage(categoryId, file);
      
      onImageUploaded(updatedCategory.imageUrl || '');
      
      toast({
        title: 'Success',
        description: 'Category image uploaded successfully',
      });
    } catch (error: any) {
      console.error('Failed to upload image:', error);
      toast({
        title: 'Upload failed',
        description: error?.message || 'Failed to upload image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    // Reset input value to allow selecting the same file again
    event.target.value = '';
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(false);
    
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDeleteImage = async () => {
    if (!categoryId || !currentImageUrl) {
      return;
    }

    try {
      const { deleteCategoryImage } = await import('@/lib/api/admin-categories');
      await deleteCategoryImage(categoryId);
      
      onImageDeleted();
      
      toast({
        title: 'Success',
        description: 'Category image deleted successfully',
      });
    } catch (error: any) {
      console.error('Failed to delete image:', error);
      toast({
        title: 'Delete failed',
        description: error?.message || 'Failed to delete image. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label className="text-white">Category Image</Label>
      
      {currentImageUrl ? (
        <div className="space-y-4">
          {/* Current Image Display */}
          <div className="relative w-full h-48 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
            <Image
              src={currentImageUrl}
              alt="Category image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
          {/* Image Actions */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={openFileDialog}
              disabled={isUploading || !categoryId}
              className="border-white text-white hover:bg-white hover:text-black"
            >
              {isUploading ? (
                <>
                  <Icons.spinner className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Icons.upload className="h-4 w-4 mr-2" />
                  Replace Image
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleDeleteImage}
              disabled={isUploading || !categoryId}
              className="border-white text-white hover:bg-red-600 hover:border-red-600"
            >
              <Icons.trash className="h-4 w-4 mr-2" />
              Delete Image
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={`relative w-full h-48 bg-gray-800 rounded-lg border-2 border-dashed transition-colors cursor-pointer ${
            dragActive 
              ? 'border-blue-400 bg-gray-700' 
              : 'border-white hover:border-gray-300 hover:bg-gray-700'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            {isUploading ? (
              <>
                <Icons.spinner className="h-8 w-8 mb-2 animate-spin" />
                <p className="text-sm">Uploading image...</p>
              </>
            ) : (
              <>
                <Icons.upload className="h-8 w-8 mb-2" />
                <p className="text-sm font-medium mb-1">
                  Drop an image here or click to browse
                </p>
                <p className="text-xs text-gray-400">
                  PNG, JPG, WEBP up to {maxFileSize}MB
                </p>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(',')}
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {!categoryId && (
        <p className="text-sm text-yellow-500">
          Save the category first to enable image upload
        </p>
      )}
    </div>
  );
}