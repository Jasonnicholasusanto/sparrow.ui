"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function BannerPhotoDialog({
  open,
  onClose,
  bannerUrl,
  onUploadClick,
  onRemove,
}: {
  open: boolean;
  onClose: () => void;
  bannerUrl: string;
  onUploadClick: () => void;
  onRemove: () => void;
}) {
  const [ratio, setRatio] = useState(16 / 9); // fallback ratio

  // Auto-detect real image aspect ratio
  useEffect(() => {
    if (!bannerUrl) return;

    const img = new window.Image();
    img.onload = () => setRatio(img.width / img.height);
    img.src = bannerUrl;
  }, [bannerUrl]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="gap-12 w-full max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-extrabold">Banner Image</DialogTitle>
        </DialogHeader>

        <div
          className="relative w-full rounded-lg overflow-hidden border"
          style={{
            aspectRatio: ratio,
          }}
        >
          <Image
            src={bannerUrl}
            alt="Banner preview"
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-row justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <div className="flex gap-2">
            <Button onClick={onUploadClick}>Upload Banner</Button>
            <Button variant="destructive" onClick={onRemove}>
              Remove Banner
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
