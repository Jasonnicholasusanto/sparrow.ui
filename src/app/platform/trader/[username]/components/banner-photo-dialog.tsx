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

type BannerPhotoDialogProps = {
  open: boolean;
  onClose: () => void;
  bannerUrl: string | undefined;
  onUploadClick: () => void;
  onRemove: () => void | Promise<void>;
  loading?: boolean;
};

export default function BannerPhotoDialog({
  open,
  onClose,
  bannerUrl,
  onUploadClick,
  onRemove,
  loading,
}: BannerPhotoDialogProps) {
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
      <DialogContent
        className="gap-12 w-full min-w-2xl"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="font-extrabold">Banner Image</DialogTitle>
        </DialogHeader>

        <div
          className="relative w-full rounded-lg overflow-hidden border"
          style={{
            aspectRatio: ratio,
          }}
        >
          {bannerUrl ? (
            <Image
              src={bannerUrl}
              alt="Banner preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          ) : (
            <div className="flex h-full min-h-48 items-center justify-center text-sm text-muted-foreground">
              No banner image
            </div>
          )}
        </div>

        <div className="flex flex-row justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <div className="flex gap-2">
            <Button onClick={onUploadClick} disabled={loading}>
              Upload Banner
            </Button>
            <Button
              variant="destructive"
              onClick={() => void onRemove()}
              disabled={loading || !bannerUrl}
            >
              Remove Banner
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
