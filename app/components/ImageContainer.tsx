"use client";

import Image from "next/image";
import { useState } from "react";

interface ImageContainerProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

const ImageContainer: React.FC<ImageContainerProps> = ({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className={`relative overflow-hidden rounded ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {isLoading && (
        <div
          data-testid="pulse-placeholder"
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ width: `${width}px`, height: `${height}px` }}
        />
      )}
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className="object-cover"
        priority={priority}
        onError={() => {
          console.error(`Failed to load image: ${imageSrc}`);
          setImageSrc("/images/front-view-shiny-new-football.jpg");
          setIsLoading(false);
        }}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

export default ImageContainer;
