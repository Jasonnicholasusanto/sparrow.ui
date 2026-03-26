"use client";

import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = url;
  });

const rad = (deg: number) => (deg * Math.PI) / 180;

function rotateSize(width: number, height: number, rotation: number) {
  const r = rad(rotation);
  return {
    width: Math.abs(Math.cos(r) * width) + Math.abs(Math.sin(r) * height),
    height: Math.abs(Math.sin(r) * width) + Math.abs(Math.cos(r) * height),
  };
}

async function getCroppedImage(
  imageSrc: string,
  pixelCrop: any,
  rotation = 0
): Promise<Blob> {
  const img = await createImage(imageSrc);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const rot = rad(rotation);

  // rotated bounding box
  const { width: bW, height: bH } = rotateSize(img.width, img.height, rotation);

  canvas.width = bW;
  canvas.height = bH;

  ctx.translate(bW / 2, bH / 2);
  ctx.rotate(rot);
  ctx.drawImage(img, -img.width / 2, -img.height / 2);

  const cropCanvas = document.createElement("canvas");
  cropCanvas.width = pixelCrop.width;
  cropCanvas.height = pixelCrop.height;

  const cropCtx = cropCanvas.getContext("2d")!;
  cropCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    cropCanvas.toBlob((blob) => {
      if (!blob) return reject("Failed to crop");
      resolve(blob);
    }, "image/jpeg");
  });
}

export default function CropProfileImageComponent({
  open,
  onClose,
  src,
  onCropped,
}: {
  open: boolean;
  onClose: () => void;
  src: string;
  onCropped: (file: File) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropComplete = useCallback((_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCrop = async () => {
    try {
      const blob = await getCroppedImage(src, croppedAreaPixels, rotation);
      const file = new File([blob], "profile.jpg", {
        type: "image/jpeg",
      });
      onCropped(file);
      onClose();
    } catch (err) {
      console.error("Cropping failed:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogTitle className="font-extrabold">Edit image</DialogTitle>
        <DialogDescription className="hidden"></DialogDescription>

        <div className="relative w-full h-80 bg-black/40 rounded-md overflow-hidden">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
          />
        </div>

        <DialogFooter className="mt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCrop}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
