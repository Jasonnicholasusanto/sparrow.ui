import { getLogoUrl } from "@/lib/utils/tickerLogo";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type WatchlistTickerPreview = {
  symbol: string;
};

export function TickerAvatarGroup({
  tickers,
  maxVisible = 7,
  maxTooltipItems = 12,
}: {
  tickers: WatchlistTickerPreview[];
  maxVisible?: number;
  maxTooltipItems?: number;
}) {
  const visibleTickers = tickers.slice(0, maxVisible);
  const remainingTickers = tickers.slice(maxVisible);
  const tooltipTickers = remainingTickers.slice(0, maxTooltipItems);
  const hiddenTooltipCount = Math.max(
    remainingTickers.length - maxTooltipItems,
    0,
  );

  return (
    <div className="flex items-center">
      {visibleTickers.map((ticker, index) => {
        const logoUrl = getLogoUrl(ticker.symbol);

        return (
          <div key={`${ticker.symbol}-${index}`} className="-ml-2 first:ml-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer border-2 border-background">
                  <AvatarImage src={logoUrl} alt={`${ticker.symbol} logo`} />
                  <AvatarFallback className="text-[10px] font-medium">
                    {ticker.symbol.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>

              <TooltipContent>
                <p>{ticker.symbol}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        );
      })}

      {remainingTickers.length > 0 ? (
        <div className="-ml-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium text-muted-foreground">
                +{remainingTickers.length}
              </div>
            </TooltipTrigger>

            <TooltipContent className="max-w-56">
              <div className="grid grid-cols-3 gap-x-3 gap-y-1">
                {tooltipTickers.map((ticker) => (
                  <span key={ticker.symbol} className="text-xs">
                    {ticker.symbol}
                  </span>
                ))}
              </div>

              {hiddenTooltipCount > 0 ? (
                <p className="mt-2 border-t pt-2 text-xs text-muted-foreground">
                  +{hiddenTooltipCount} more
                </p>
              ) : null}
            </TooltipContent>
          </Tooltip>
        </div>
      ) : null}
    </div>
  );
}
