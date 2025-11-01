'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/ui/icons';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface ImageItem {
  id: string;
  file?: File;
  url: string;
  preview: string;
}

interface ImageUploadManagerProps {
  images: ImageItem[];
  onImagesChange: (images: ImageItem[]) => void;
  maxImages?: number;
  maxFileSize?: number; // in MB
  acceptedFormats?: string[];
}

export function ImageUploadManager({
  images,
  onImagesChange,
  maxImages = 10,
  maxFileSize = 5,
  acceptedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
}: ImageUploadManagerProps) {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
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

  const processFiles = useCallback(async (files: FileList) => {
    if (images.length + files.length > maxImages) {
      toast({
        title: 'Too many images',
        description: `Maximum ${maxImages} images allowed`,
        variant: 'destructive',
      });
      return;
    }

    const newImages: ImageItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validationError = validateFile(file);
      
      if (validationError) {
        toast({
          title: 'Invalid file',
          description: validationError,
          variant: 'destructive',
        });
        continue;
      }

      const id = `${Date.now()}_${Math.random()}`;
      const preview = URL.createObjectURL(file);
      
      newImages.push({
        id,
        file,
        url: '', // Will be set after upload
        preview
      });
    }

    if (newImages.length > 0) {
      onImagesChange([...images, ...newImages]);
    }
  }, [images, maxImages, maxFileSize, acceptedFormats, onImagesChange, toast]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    // Reset input value to allow selecting the same file again
    event.target.value = '';
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOverIndex(null);
    
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDragStart = (event: React.DragEvent, index: number) => {
    event.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragEnter = (index: number) => {
    setDragOverIndex(index);
  };

  const handleDropReorder = (event: React.DragEvent, dropIndex: number) => {
    event.preventDefault();
    const dragIndex = parseInt(event.dataTransfer.getData('text/plain'));
    
    if (dragIndex === dropIndex) {
      setDragOverIndex(null);
      return;
    }

    const newImages = [...images];
    const draggedItem = newImages[dragIndex];
    
    // Remove dragged item
    newImages.splice(dragIndex, 1);
    
    // Insert at new position
    newImages.splice(dropIndex, 0, draggedItem);
    
    onImagesChange(newImages);
    setDragOverIndex(null);
  };

  const removeImage = (index: number) => {
    const imageToRemove = images[index];
    if (imageToRemove.preview && imageToRemove.preview.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const setPrimaryImage = (index: number) => {
    if (index === 0) return; // Already primary
    
    const newImages = [...images];
    const primaryImage = newImages[index];
    
    // Remove from current position
    newImages.splice(index, 1);
    // Add to beginning
    newImages.unshift(primaryImage);
    
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-semibold text-white">Product Images</Label>
        <span className="text-sm text-gray-300">
          {images.length} / {maxImages} images
        </span>
      </div>

      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center transition-colors hover:border-white/50"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFormats.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
            <Icons.upload className="w-8 h-8 text-white" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Upload Product Images
            </h3>
            <p className="text-gray-300 mb-4">
              Drag and drop images here, or click to browse
            </p>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={images.length >= maxImages}
              className="border-white/30 text-white hover:bg-white/10 hover:border-white/50"
            >
              <Icons.plus className="w-4 h-4 mr-2" />
              {images.length === 0 ? 'Add Images' : 'Add More Images'}
            </Button>
            
            <p className="text-xs text-gray-400 mt-2">
              Max {maxImages} images, up to {maxFileSize}MB each. 
              Supported: {acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')}
            </p>
          </div>
        </div>
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <Card
              key={image.id}
              className={`group cursor-move border-white/20 bg-black/50 ${
                dragOverIndex === index ? 'ring-2 ring-blue-500' : ''
              }`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropReorder(e, index)}
            >
              <CardContent className="p-2">
                <div className="relative aspect-square">
                  <img
                    src={image.preview}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                  
                  {/* Overlay with controls */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex gap-2">
                      {index !== 0 && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setPrimaryImage(index)}
                          className="h-8 w-8 p-0"
                        >
                          <Icons.star className="w-4 h-4" />
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeImage(index)}
                        className="h-8 w-8 p-0"
                      >
                        <Icons.x className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Primary badge */}
                  {index === 0 && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded font-semibold">
                        Primary
                      </span>
                    </div>
                  )}
                  
                  {/* Drag handle */}
                  <div className="absolute top-2 right-2">
                    <div className="bg-black/70 rounded p-1">
                      <Icons.gripVertical className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-gray-300 mt-2 text-center">
                  Image {index + 1}
                  {index === 0 && ' (Primary)'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <div className="text-center">
          <p className="text-sm text-gray-400">
            💡 Drag images to reorder • Click ⭐ to set as primary • First image is shown as main product image
          </p>
        </div>
      )}
    </div>
  );
}