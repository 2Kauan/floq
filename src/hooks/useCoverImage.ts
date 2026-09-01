import { useState, useEffect } from 'react';
import { db } from '../db/database';

const urlCache = new Map<string, string>();

export function useCoverImage(coverId: string | null | undefined) {
  const [coverUrl, setCoverUrl] = useState<string | null>(() => {
    if (coverId && urlCache.has(coverId)) {
      return urlCache.get(coverId)!;
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(coverId && !urlCache.has(coverId)));

  useEffect(() => {
    if (!coverId) {
      setCoverUrl(null);
      setIsLoading(false);
      return;
    }

    if (urlCache.has(coverId)) {
      setCoverUrl(urlCache.get(coverId)!);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    db.coverImages.get(coverId).then((cover) => {
      if (!isMounted) return;
      if (cover && cover.blob) {
        const url = URL.createObjectURL(cover.blob);
        urlCache.set(coverId, url);
        setCoverUrl(url);
      } else {
        setCoverUrl(null);
      }
      setIsLoading(false);
    }).catch(() => {
      if (isMounted) {
        setCoverUrl(null);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [coverId]);

  return { coverUrl, isLoading };
}

// Function to invalidate cache when a cover is replaced
export function invalidateCoverCache(coverId: string) {
  if (urlCache.has(coverId)) {
    const url = urlCache.get(coverId)!;
    URL.revokeObjectURL(url);
    urlCache.delete(coverId);
  }
}
