import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImageViewerProps {
  images: string[];
  onClose: () => void;
  onAddImage: (newImage: string) => void;
  onDeleteImage: (imageToDelete: string) => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  images,
  onClose,
  onAddImage,
  onDeleteImage,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : images.length - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < images.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handleAddImage = () => {
    if (newImageUrl.trim() === "") return;

    onAddImage(newImageUrl);
    setNewImageUrl("");
    setSuccessMessage("Image added successfully!");
    setTimeout(() => setSuccessMessage(""), 2000);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[75%] sm:h-[75vh]">
        <DialogHeader>
          <DialogTitle>Product Images</DialogTitle>
        </DialogHeader>
        <div className="relative w-full h-full">
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Display image */}
          {images.length > 0 ? (
            <img
              src={images[currentIndex]}
              alt={`Product image ${currentIndex + 1}`}
              className="w-full h-full object-contain"
            />
          ) : (
            <p className="text-center mt-4">No images available.</p>
          )}

          {images.length > 1 && (
            <>
              <Button
                onClick={handlePrevious}
                variant="ghost"
                size="icon"
                className="absolute top-1/2 left-2 transform -translate-y-1/2"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                onClick={handleNext}
                variant="ghost"
                size="icon"
                className="absolute top-1/2 right-2 transform -translate-y-1/2"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}
        </div>

    
        <div className="mt-4">
          <Input
            type="text"
            placeholder="Enter image URL"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
          />
          <Button className="mt-2" onClick={handleAddImage}>
            Add Image
          </Button>
          {successMessage && (
            <p className="text-green-500 mt-2">{successMessage}</p>
          )}
        </div>

      
        {images.length > 0 && (
          <Button
            className="mt-4"
            variant="destructive"
            onClick={() => onDeleteImage(images[currentIndex])}
          >
            Delete Current Image
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImageViewer;
