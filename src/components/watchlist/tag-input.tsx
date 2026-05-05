"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { Check, Loader2, Plus, Search, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { searchTagsClient } from "@/lib/data/client/tags";
import { TagSearchResult } from "@/schemas/tags";

type TagInputProps = {
  value: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
  placeholder?: string;
  debounceMs?: number;
  minSearchLength?: number;
};

function normalizeTag(tag: string) {
  return tag.trim();
}

function uniqueTags(tags: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const tag of tags) {
    const normalized = normalizeTag(tag);
    const key = normalized.toLowerCase();
    if (!normalized || seen.has(key)) continue;
    seen.add(key);
    result.push(normalized);
  }

  return result;
}

export function TagInput({
  value,
  onChange,
  maxTags = 10,
  placeholder = "Search or create tags...",
  debounceMs = 800,
  minSearchLength = 1,
}: TagInputProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TagSearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [hasSearched, setHasSearched] = useState(false);
  const [isPending, startTransition] = useTransition();

  const selectedKeys = useMemo(
    () => new Set(value.map((tag) => tag.trim().toLowerCase())),
    [value],
  );

  const visibleResults = useMemo(() => {
    return results.filter(
      (tag) => !selectedKeys.has(tag.name.trim().toLowerCase()),
    );
  }, [results, selectedKeys]);

  const trimmedQuery = query.trim();

  const canCreate = useMemo(() => {
    if (!trimmedQuery) return false;

    const exactSelected = selectedKeys.has(trimmedQuery.toLowerCase());
    const exactExisting = results.some(
      (tag) => tag.name.trim().toLowerCase() === trimmedQuery.toLowerCase(),
    );

    return !exactSelected && !exactExisting;
  }, [trimmedQuery, selectedKeys, results]);

  const menuItemsCount = visibleResults.length + (canCreate ? 1 : 0);

  const addTag = useCallback(
    (tag: string) => {
      const next = uniqueTags([...value, tag]).slice(0, maxTags);
      onChange(next);
      setQuery("");
      setResults([]);
      setOpen(false);
      setActiveIndex(-1);
      setHasSearched(false);
    },
    [maxTags, onChange, value],
  );

  const removeTag = useCallback(
    (tagToRemove: string) => {
      onChange(
        value.filter(
          (tag) =>
            tag.trim().toLowerCase() !== tagToRemove.trim().toLowerCase(),
        ),
      );
    },
    [onChange, value],
  );

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    if (trimmedQuery.length < minSearchLength) {
      setResults([]);
      setHasSearched(false);
      setActiveIndex(-1);
      return;
    }

    const timer = window.setTimeout(() => {
      let cancelled = false;

      startTransition(async () => {
        try {
          const data = await searchTagsClient(trimmedQuery, 8);
          if (cancelled) return;

          console.log(data);

          setResults(Array.isArray(data) ? data : []);
          setHasSearched(true);
          setActiveIndex(-1);
        } catch (error) {
          if (cancelled) return;
          console.error(error);
          setResults([]);
          setHasSearched(true);
          setActiveIndex(-1);
        }
      });

      return () => {
        cancelled = true;
      };
    }, debounceMs);

    return () => window.clearTimeout(timer);
  }, [debounceMs, minSearchLength, open, trimmedQuery]);

  function handleSelectExisting(tag: TagSearchResult) {
    addTag(tag.name);
  }

  function handleCreateNew() {
    if (!canCreate) return;
    addTag(trimmedQuery);
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !query && value.length > 0) {
      e.preventDefault();
      removeTag(value[value.length - 1]);
      return;
    }

    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (menuItemsCount === 0) return;
      setActiveIndex((prev) => (prev + 1) % menuItemsCount);
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (menuItemsCount === 0) return;
      setActiveIndex((prev) => (prev <= 0 ? menuItemsCount - 1 : prev - 1));
      return;
    }

    if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();

      if (activeIndex >= 0) {
        if (activeIndex < visibleResults.length) {
          handleSelectExisting(visibleResults[activeIndex]);
          return;
        }

        if (canCreate && activeIndex === visibleResults.length) {
          handleCreateNew();
          return;
        }
      }

      if (visibleResults.length > 0) {
        handleSelectExisting(visibleResults[0]);
        return;
      }

      if (canCreate) {
        handleCreateNew();
      }
    }
  }

  return (
    <div ref={containerRef} className="space-y-2">
      {value.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="rounded-full px-3 py-1 text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-2 inline-flex"
                aria-label={`Remove ${tag}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </Badge>
          ))}
        </div>
      ) : null}

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          placeholder={placeholder}
          className="pl-9"
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onKeyDown={handleInputKeyDown}
        />

        {open && (
          <div className="absolute z-50 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border bg-popover p-1 shadow-lg">
            {isPending ? (
              <div className="flex items-center gap-2 px-3 py-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching tags...
              </div>
            ) : (
              <>
                {visibleResults.map((tag, index) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleSelectExisting(tag)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-muted ${
                      activeIndex === index ? "bg-muted" : ""
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {tag.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {tag.category ? `${tag.category} · ` : ""}
                        {tag.publicWatchlistCount} public watchlist
                        {tag.publicWatchlistCount === 1 ? "" : "s"}
                      </div>
                    </div>

                    {selectedKeys.has(tag.name.trim().toLowerCase()) ? (
                      <Check className="h-4 w-4 text-muted-foreground" />
                    ) : null}
                  </button>
                ))}

                {canCreate ? (
                  <button
                    type="button"
                    onClick={handleCreateNew}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left hover:bg-muted ${
                      activeIndex === visibleResults.length ? "bg-muted" : ""
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="text-sm">
                      Create "
                      <span className="font-medium">{trimmedQuery}</span>"
                    </span>
                  </button>
                ) : null}

                {!isPending &&
                hasSearched &&
                visibleResults.length === 0 &&
                !canCreate ? (
                  <div className="px-3 py-3 text-sm text-muted-foreground">
                    No tags found.
                  </div>
                ) : null}

                {!trimmedQuery && visibleResults.length === 0 ? (
                  <div className="px-3 py-3 text-sm text-muted-foreground">
                    Start typing to search tags.
                  </div>
                ) : null}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
