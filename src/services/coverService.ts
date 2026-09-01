import { db } from '../db/database';
import { CoverImage } from '../types';
import { generateId } from '../utils/id';
import { processImageBlob } from '../utils/canvas';

export async function searchCoverByTitle(title: string): Promise<Blob | null> {
  const cleanTitle = title.trim();
  if (cleanTitle.length < 3) return null;

  try {
    const encoded = encodeURIComponent(cleanTitle);
    const url = `https://covers.openlibrary.org/b/title/${encoded}-L.jpg`;
    const response = await fetch(url);
    if (!response.ok) return null;

    const blob = await response.blob();
    // 1x1px blank placeholders returned by Open Library are typically < 1000 bytes
    if (blob.size < 900) return null;

    // Check if the image really has dimensions > 1x1
    const isValid = await new Promise<boolean>((resolve) => {
      const img = new Image();
      const objUrl = URL.createObjectURL(blob);
      img.onload = () => {
        URL.revokeObjectURL(objUrl);
        resolve(img.naturalWidth > 10 && img.naturalHeight > 10);
      };
      img.onerror = () => {
        URL.revokeObjectURL(objUrl);
        resolve(false);
      };
      img.src = objUrl;
    });

    if (!isValid) return null;
    return await processImageBlob(blob);
  } catch {
    return null;
  }
}

export async function searchCoverByIsbn(isbn: string): Promise<Blob | null> {
  const cleanIsbn = isbn.replace(/[^0-9X]/gi, '');
  if (!cleanIsbn) return null;

  try {
    const url = `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-L.jpg`;
    const response = await fetch(url);
    if (!response.ok) return null;

    const blob = await response.blob();
    if (blob.size < 900) return null;

    const isValid = await new Promise<boolean>((resolve) => {
      const img = new Image();
      const objUrl = URL.createObjectURL(blob);
      img.onload = () => {
        URL.revokeObjectURL(objUrl);
        resolve(img.naturalWidth > 10 && img.naturalHeight > 10);
      };
      img.onerror = () => {
        URL.revokeObjectURL(objUrl);
        resolve(false);
      };
      img.src = objUrl;
    });

    if (!isValid) return null;
    return await processImageBlob(blob);
  } catch {
    return null;
  }
}

export async function saveCoverImage(
  blob: Blob,
  originalSource: 'upload' | 'api' | 'camera'
): Promise<string> {
  const id = generateId();
  const processed = await processImageBlob(blob);
  const coverImage: CoverImage = {
    id,
    blob: processed,
    mimeType: 'image/jpeg',
    originalSource,
  };

  await db.coverImages.put(coverImage);
  return id;
}

export async function getCoverImage(coverId: string): Promise<CoverImage | undefined> {
  return db.coverImages.get(coverId);
}

export async function deleteCoverImage(coverId: string): Promise<void> {
  await db.coverImages.delete(coverId);
}
