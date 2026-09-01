import { PixelCrop } from 'react-image-crop';

/**
 * Resizes and compresses an image file/blob to max 400x600px with JPEG 0.85
 */
export async function processImageBlob(blob: Blob, maxWidth = 400, maxHeight = 600, quality = 0.85): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(blob);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      try {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(blob);
          return;
        }

        // Fill background with white for transparent PNGs converted to JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (result) => {
            if (result) {
              resolve(result);
            } else {
              resolve(blob);
            }
          },
          'image/jpeg',
          quality
        );
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Erro ao carregar imagem para processamento.'));
    };

    img.src = objectUrl;
  });
}

/**
 * Crops an HTMLImageElement using PixelCrop coordinates and returns compressed Blob
 */
export async function getCroppedImageBlob(
  image: HTMLImageElement,
  crop: PixelCrop,
  maxWidth = 400,
  maxHeight = 600,
  quality = 0.85
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const targetWidth = Math.min(maxWidth, Math.round(crop.width * scaleX));
    const targetHeight = Math.min(maxHeight, Math.round(crop.height * scaleY));

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Falha ao obter contexto 2D do Canvas.'));
      return;
    }

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      targetWidth,
      targetHeight
    );

    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Falha ao gerar Blob do Canvas.'));
        }
      },
      'image/jpeg',
      quality
    );
  });
}
