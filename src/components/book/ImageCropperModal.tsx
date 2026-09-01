import React, { useState, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { getCroppedImageBlob, processImageBlob } from '../../utils/canvas';

export interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  rawBlob: Blob | null;
  onCropConfirmed: (blob: Blob) => void;
  onClose: () => void;
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export function ImageCropperModal({
  isOpen,
  imageSrc,
  rawBlob,
  onCropConfirmed,
  onClose,
}: ImageCropperModalProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isProcessing, setIsProcessing] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 2 / 3));
  };

  const handleCropAndSave = async () => {
    if (!imgRef.current || !completedCrop) {
      handleUseOriginal();
      return;
    }

    try {
      setIsProcessing(true);
      const croppedBlob = await getCroppedImageBlob(
        imgRef.current,
        completedCrop,
        400,
        600,
        0.85
      );
      onCropConfirmed(croppedBlob);
      onClose();
    } catch {
      handleUseOriginal();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUseOriginal = async () => {
    if (!rawBlob) return;
    try {
      setIsProcessing(true);
      const processed = await processImageBlob(rawBlob, 400, 600, 0.85);
      onCropConfirmed(processed);
      onClose();
    } catch {
      onCropConfirmed(rawBlob);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  if (!imageSrc) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ajustar Capa"
      description="Recorte a imagem na proporção 2:3 para melhor apresentação na estante."
      maxWidth="lg"
    >
      <div className="flex flex-col items-center">
        <div className="max-h-[55vh] overflow-hidden flex items-center justify-center bg-black/5 rounded-lg border border-border p-2 w-full">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={2 / 3}
            className="max-h-[50vh]"
          >
            <img
              ref={imgRef}
              alt="Imagem para recorte"
              src={imageSrc}
              onLoad={onImageLoad}
              className="max-h-[50vh] object-contain"
            />
          </ReactCrop>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full mt-6 pt-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isProcessing}
            className="w-full sm:w-auto order-3 sm:order-1"
          >
            Cancelar
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto order-1 sm:order-2">
            <Button
              variant="secondary"
              onClick={handleUseOriginal}
              disabled={isProcessing}
              className="flex-1 sm:flex-initial"
            >
              Usar sem recortar
            </Button>
            <Button
              variant="primary"
              onClick={handleCropAndSave}
              isLoading={isProcessing}
              className="flex-1 sm:flex-initial"
            >
              Recortar e usar
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
