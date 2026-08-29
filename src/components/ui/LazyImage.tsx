import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface LazyImageProps {
  src?: string;
  alt?: string;
  className?: string;
  containerClassName?: string;
  fallbackClassName?: string;
  loading?: "eager" | "lazy";
  onLoad?: (e: any) => void;
  onError?: (e: any) => void;
}

export function LazyImage({ src, alt, className, containerClassName = "", fallbackClassName = "", ...props }: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-white/5 ${containerClassName}`}>
      {(!loaded && !error) && (
        <div className={`absolute inset-0 flex items-center justify-center ${fallbackClassName}`}>
          <div className="absolute inset-0 animate-pulse bg-gold-500/10 mix-blend-overlay"></div>
          <Loader2 className="w-8 h-8 text-gold-500/50 animate-spin z-10" />
        </div>
      )}
      
      {error && (
        <div className={`absolute inset-0 flex items-center justify-center bg-zinc-900/50 ${fallbackClassName}`}>
          <span className="text-zinc-500 text-sm">Failed to load image</span>
        </div>
      )}

      {src && !error && (
        <img
          src={src}
          alt={alt || ""}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`transition-opacity duration-700 ease-in-out ${loaded ? 'opacity-100' : 'opacity-0'} ${className || ''}`}
          {...props}
        />
      )}
    </div>
  );
}
