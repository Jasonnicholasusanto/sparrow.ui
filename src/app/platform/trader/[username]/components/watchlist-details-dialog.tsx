"use client";

import * as React from "react";
import { Globe, Lock, Users } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { WatchlistDetailOut } from "@/schemas/watchlist";
import { WatchlistDetailsItemCard } from "./watchlist-details-items-card";
import { WatchlistDialog } from "@/components/watchlist/watchlist-dialog";

type WatchlistDetailsDialogProps = {
  trigger: React.ReactNode;
  watchlist: WatchlistDetailOut;
  isOwnProfile: boolean;
  onRefresh: () => void | Promise<void>;
};

function getVisibilityIcon(visibility: string) {
  const normalized = visibility.toLowerCase();

  if (normalized === "private") return <Lock className="h-3.5 w-3.5" />;
  if (normalized === "shared") return <Users className="h-3.5 w-3.5" />;
  return <Globe className="h-3.5 w-3.5" />;
}

export function WatchlistDetailsDialog({
  trigger,
  watchlist,
  isOwnProfile,
  onRefresh,
}: WatchlistDetailsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="min-w-3xl max-w-5xl overflow-hidden">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>{watchlist.name}</DialogTitle>
            <Badge variant="outline" className="gap-1 rounded-full">
              {getVisibilityIcon(watchlist.visibility)}
              {watchlist.visibility}
            </Badge>
          </div>

          <DialogDescription>
            {watchlist.description || "No description provided."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2">
          {watchlist.tags?.map((tag) => (
            <Badge key={tag.id} variant="secondary" className="rounded-full">
              {tag.name}
            </Badge>
          ))}
        </div>

        <Separator />

        <ScrollArea className="max-h-112 pr-3">
          <div className="space-y-3">
            {watchlist.items?.length ? (
              watchlist.items.map((item) => (
                <WatchlistDetailsItemCard key={item.id} item={item} />
              ))
            ) : (
              <div className="rounded-xl border border-dashed px-6 py-10 text-center text-sm text-muted-foreground">
                This watchlist has no items.
              </div>
            )}
          </div>
        </ScrollArea>

        {isOwnProfile ? (
          <>
            <Separator />
            <div className="flex justify-end">
              <WatchlistDialog
                mode="edit"
                watchlist={watchlist}
                onSuccess={onRefresh}
                trigger={
                  <Button type="button" variant="outline">
                    Edit watchlist
                  </Button>
                }
              />
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
