export const NGX_STOCKS: StockWithWatchlistStatus[] = [
  { symbol: "NGX:GTCO", name: "Guaranty Trust Holding Company", exchange: "NGX", type: "Banking", isInWatchlist: false },
  { symbol: "NGX:ZENITHBANK", name: "Zenith Bank", exchange: "NGX", type: "Banking", isInWatchlist: false },
  { symbol: "NGX:ACCESSCORP", name: "Access Holdings", exchange: "NGX", type: "Banking", isInWatchlist: false },
  { symbol: "NGX:UBA", name: "United Bank for Africa", exchange: "NGX", type: "Banking", isInWatchlist: false },
  { symbol: "NGX:FBNH", name: "First HoldCo", exchange: "NGX", type: "Banking", isInWatchlist: false },
  { symbol: "NGX:STANBIC", name: "Stanbic IBTC Holdings", exchange: "NGX", type: "Banking", isInWatchlist: false },
  { symbol: "NGX:WEMABANK", name: "Wema Bank", exchange: "NGX", type: "Banking", isInWatchlist: false },
  { symbol: "NGX:FCMB", name: "FCMB Group", exchange: "NGX", type: "Banking", isInWatchlist: false },
  { symbol: "NGX:MTNN", name: "MTN Nigeria Communications", exchange: "NGX", type: "Telecommunications", isInWatchlist: false },
  { symbol: "NGX:AIRTELAFRI", name: "Airtel Africa", exchange: "NGX", type: "Telecommunications", isInWatchlist: false },
  { symbol: "NGX:DANGCEM", name: "Dangote Cement", exchange: "NGX", type: "Industrials", isInWatchlist: false },
  { symbol: "NGX:BUAFOODS", name: "BUA Foods", exchange: "NGX", type: "Consumer Goods", isInWatchlist: false },
  { symbol: "NGX:BUACEMENT", name: "BUA Cement", exchange: "NGX", type: "Industrials", isInWatchlist: false },
  { symbol: "NGX:DANGSUGAR", name: "Dangote Sugar Refinery", exchange: "NGX", type: "Consumer Goods", isInWatchlist: false },
  { symbol: "NGX:NASCON", name: "NASCON Allied Industries", exchange: "NGX", type: "Consumer Goods", isInWatchlist: false },
  { symbol: "NGX:FLOURMILL", name: "Flour Mills of Nigeria", exchange: "NGX", type: "Consumer Goods", isInWatchlist: false },
  { symbol: "NGX:NB", name: "Nigerian Breweries", exchange: "NGX", type: "Consumer Goods", isInWatchlist: false },
  { symbol: "NGX:SEPLAT", name: "Seplat Energy", exchange: "NGX", type: "Energy", isInWatchlist: false },
  { symbol: "NGX:OANDO", name: "Oando", exchange: "NGX", type: "Energy", isInWatchlist: false },
  { symbol: "NGX:TRANSCORP", name: "Transcorp Group", exchange: "NGX", type: "Conglomerates", isInWatchlist: false },
  { symbol: "NGX:PRESCO", name: "Presco", exchange: "NGX", type: "Agriculture", isInWatchlist: false },
  { symbol: "NGX:OKOMUOIL", name: "Okomu Oil Palm", exchange: "NGX", type: "Agriculture", isInWatchlist: false },
  { symbol: "NGX:WAPCO", name: "Lafarge Africa", exchange: "NGX", type: "Industrials", isInWatchlist: false },
  { symbol: "NGX:CUSTODIAN", name: "Custodian Investment", exchange: "NGX", type: "Financial Services", isInWatchlist: false },
 ];

export function searchLocalNGXStocks(query = ""): StockWithWatchlistStatus[] {
  const normalized = query.trim().toLowerCase().replace(/^ngx:/, "");
  const unique = new Map<string, StockWithWatchlistStatus>();
  for (const stock of NGX_STOCKS) unique.set(stock.symbol, stock);
  const stocks = [...unique.values()];
  if (!normalized) return stocks.slice(0, 20);
  return stocks.filter((stock) =>
    stock.symbol.toLowerCase().includes(normalized) ||
    stock.symbol.toLowerCase().replace(/^ngx:/, "").includes(normalized) ||
    stock.name.toLowerCase().includes(normalized) ||
    stock.type.toLowerCase().includes(normalized)
  ).slice(0, 15);
}
