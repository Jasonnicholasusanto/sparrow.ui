"use client";

import { Globe, Lock, Users } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { WatchlistDetailOut } from "@/schemas/watchlist";

type WatchlistDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
  open,
  onOpenChange,
  watchlist,
  isOwnProfile,
}: WatchlistDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                <div
                  key={item.id}
                  className="rounded-xl border p-4 flex items-start justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{item.symbol}</p>
                      <Badge variant="outline" className="rounded-full">
                        {item.exchange}
                      </Badge>
                    </div>

                    {item.note ? (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.note}
                      </p>
                    ) : null}
                  </div>

                  <div className="text-right text-sm text-muted-foreground">
                    <p>Position: {item.position ?? "—"}</p>
                    <p>Quantity: {item.quantity ?? "—"}</p>
                  </div>
                </div>
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
              <Button type="button" variant="outline">
                Edit watchlist
              </Button>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
