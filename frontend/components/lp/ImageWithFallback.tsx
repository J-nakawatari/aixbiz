import Image from 'next/image';
import { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export function ImageWithFallback({ src, alt, className, width = 800, height = 600 }: ImageWithFallbackProps) {
  const [error, setError] = useState(false);
  
  // プレースホルダー画像のURL
  const fallbackSrc = `https://placehold.co/${width}x${height}/e0e7ff/4338ca?text=${encodeURIComponent(alt)}`;
  
  return (
    <Image
      src={error ? fallbackSrc : src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setError(true)}
    />
  );
}