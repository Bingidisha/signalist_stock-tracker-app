import TradingViewWidget from "@/components/TradingViewWidget";
import { getAuth } from "@/lib/better-auth/auth";
import { getWatchlistSymbolsByEmail } from "@/lib/actions/watchlist.actions";
import { headers } from "next/headers";
import { NGX_STOCKS } from "@/lib/ngx-stocks";
import WatchlistButton from "@/components/WatchlistButton";
import {
  SYMBOL_INFO_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  BASELINE_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
  COMPANY_PROFILE_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
} from "@/lib/constants";

export default async function StockDetails({ params }: StockDetailsPageProps) {
  const { symbol } = await params;
  const normalizedSymbol = decodeURIComponent(symbol).toUpperCase();
  const stock = NGX_STOCKS.find((item) => item.symbol === normalizedSymbol);
  const displayName = stock?.name || normalizedSymbol;
  const chartSymbol = normalizedSymbol.startsWith("NGX:")
    ? normalizedSymbol.replace(/^NGX:/, "NSENG:")
    : normalizedSymbol;
  let isInWatchlist = false;
  try {
    const auth = await getAuth();
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user?.email) {
      const symbols = await getWatchlistSymbolsByEmail(session.user.email);
      isInWatchlist = symbols.includes(normalizedSymbol);
    }
  } catch (error) {
    if (!(error instanceof Error && error.message.includes("MONGODB_URI must be set"))) throw error;
  }
  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

  return (
    <div className="flex min-h-screen p-4 md:p-6 lg:p-8">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          <TradingViewWidget
            scriptUrl={`${scriptUrl}symbol-info.js`}
            config={SYMBOL_INFO_WIDGET_CONFIG(chartSymbol)}
            height={170}
          />

          <TradingViewWidget
            scriptUrl={`${scriptUrl}advanced-chart.js`}
            config={CANDLE_CHART_WIDGET_CONFIG(chartSymbol)}
            className="custom-chart"
            height={600}
          />

          <TradingViewWidget
            scriptUrl={`${scriptUrl}advanced-chart.js`}
            config={BASELINE_WIDGET_CONFIG(chartSymbol)}
            className="custom-chart"
            height={600}
          />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <WatchlistButton symbol={normalizedSymbol} company={displayName} isInWatchlist={isInWatchlist} />
          </div>

          <TradingViewWidget
            scriptUrl={`${scriptUrl}technical-analysis.js`}
            config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(chartSymbol)}
            height={400}
          />

          <TradingViewWidget
            scriptUrl={`${scriptUrl}company-profile.js`}
            config={COMPANY_PROFILE_WIDGET_CONFIG(chartSymbol)}
            height={440}
          />

          <TradingViewWidget
            scriptUrl={`${scriptUrl}financials.js`}
            config={COMPANY_FINANCIALS_WIDGET_CONFIG(chartSymbol)}
            height={464}
          />
        </div>
      </section>
    </div>
  );
}
