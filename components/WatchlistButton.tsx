"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { setWatchlistStatus } from "@/lib/actions/watchlist.actions";

const WatchlistButton = ({
  symbol,
  company,
  isInWatchlist,
  showTrashIcon = false,
  type = "button",
  onWatchlistChange,
}: WatchlistButtonProps) => {
  const [added, setAdded] = useState<boolean>(!!isInWatchlist);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const label = useMemo(() => {
    if (type === "icon") return "";
    return added ? "Remove from Watchlist" : "Add to Watchlist";
  }, [added, type]);

  const handleClick = async () => {
    if (busy) return;
    setBusy(true);
    setMessage("");
    const next = !added;
    try {
      const result = await setWatchlistStatus(symbol, company, next);
      if (!result.success) {
        setMessage(result.error || "Could not update watchlist");
        if (result.error?.toLowerCase().includes("sign in")) router.push("/sign-in");
        return;
      }
      setAdded(next);
      onWatchlistChange?.(symbol, next);
      router.refresh();
    } catch {
      setMessage("Could not update watchlist. Check your database configuration.");
    } finally {
      setBusy(false);
    }
  };

  if (type === "icon") {
    return (
      <div className="flex flex-col items-center gap-1">
        <button
          type="button"
          disabled={busy}
          title={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
          aria-label={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
          className={`watchlist-icon-btn ${added ? "watchlist-icon-added" : ""} ${busy ? "opacity-50" : ""}`}
          onClick={handleClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={added ? "#FACC15" : "none"} stroke="#FACC15" strokeWidth="1.5" className="watchlist-star">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557L3.04 10.385a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345l2.125-5.111z" />
          </svg>
        </button>
        {message && <span className="max-w-40 text-xs text-red-400">{message}</span>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <button type="button" disabled={busy} className={`watchlist-btn ${added ? "watchlist-remove" : ""} ${busy ? "opacity-50" : ""}`} onClick={handleClick}>
        {showTrashIcon && added ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-7 4v6m4-6v6m4-6v6" />
          </svg>
        ) : null}
        <span>{busy ? "Saving..." : label}</span>
      </button>
      {message && <span className="max-w-xs text-xs text-red-400">{message}</span>}
    </div>
  );
};

export default WatchlistButton;
