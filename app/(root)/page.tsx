import Link from "next/link";
import TradingViewWidget from "@/components/TradingViewWidget";
import { NGX_STOCKS } from "@/lib/ngx-stocks";
import {
    HEATMAP_WIDGET_CONFIG,
    MARKET_DATA_WIDGET_CONFIG,
    MARKET_OVERVIEW_WIDGET_CONFIG,
    TOP_STORIES_WIDGET_CONFIG
} from "@/lib/constants";

const Home = () => {
    const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

    return (
        <div className="flex min-h-screen flex-col home-wrapper">
          <section className="mb-8 w-full rounded-xl border border-gray-800 bg-gray-900/50 p-5">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-widest text-yellow-500">Nigerian Exchange</p>
                <h2 className="mt-1 text-2xl font-semibold text-white">Popular NGX stocks</h2>
                <p className="mt-1 text-sm text-gray-400">Browse Nigerian-listed companies and open their charts.</p>
              </div>
              <Link href="/search" className="text-sm font-medium text-yellow-500 hover:underline">Search all stocks →</Link>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {NGX_STOCKS.slice(0, 8).map((stock) => (
                <Link key={stock.symbol} href={`/stocks/${encodeURIComponent(stock.symbol)}`} className="rounded-lg border border-gray-800 bg-black/20 p-4 transition hover:border-yellow-500/60">
                  <span className="block text-sm text-gray-400">{stock.type}</span>
                  <span className="mt-1 block font-semibold text-white">{stock.name}</span>
                  <span className="mt-2 block text-xs text-yellow-500">{stock.symbol.replace("NGX:", "")} · NGX</span>
                </Link>
              ))}
            </div>
          </section>
          <section className="grid w-full gap-8 home-section">
              <div className="md:col-span-1 xl:col-span-1">
                  <TradingViewWidget
                    title="Market Overview"
                    scriptUrl={`${scriptUrl}market-overview.js`}
                    config={MARKET_OVERVIEW_WIDGET_CONFIG}
                    className="custom-chart"
                    height={600}
                  />
              </div>
              <div className="md-col-span xl:col-span-2">
                  <TradingViewWidget
                      title="Stock Heatmap"
                      scriptUrl={`${scriptUrl}stock-heatmap.js`}
                      config={HEATMAP_WIDGET_CONFIG}
                      height={600}
                  />
              </div>
          </section>
            <section className="grid w-full gap-8 home-section">
                <div className="h-full md:col-span-1 xl:col-span-1">
                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}timeline.js`}
                        config={TOP_STORIES_WIDGET_CONFIG}
                        height={600}
                    />
                </div>
                <div className="h-full md:col-span-1 xl:col-span-2">
                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}market-quotes.js`}
                        config={MARKET_DATA_WIDGET_CONFIG}
                        height={600}
                    />
                </div>
            </section>
        </div>
    )
}

export default Home;
