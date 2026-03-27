"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FaUserCircle } from "react-icons/fa";

export default function ProfilePhotoDialog({
  open,
  onClose,
  avatarUrl,
  onUploadClick,
  onRemove,
}: {
  open: boolean;
  onClose: () => void;
  avatarUrl: string | undefined;
  onUploadClick: () => void;
  onRemove: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="gap-12 max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-extrabold">Profile Photo</DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden"></DialogDescription>

        <div className="flex justify-center">
          <Avatar className="w-64 h-64 border border-border">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>
              <FaUserCircle className="size-60 text-muted" />
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex flex-row justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <div className="flex flex-row gap-2">
            <Button onClick={onUploadClick}>Upload Photo</Button>

            <Button variant="destructive" onClick={onRemove}>
              Remove Photo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
