import SearchCommand from "@/components/SearchCommand";
import { searchStocks } from "@/lib/actions/finnhub.actions";

export default async function SearchPage() {
  const initialStocks = await searchStocks();

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6">
      <div>
        <p className="text-sm uppercase tracking-widest text-yellow-500">Explore the market</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Search stocks</h1>
        <p className="mt-2 text-gray-400">Search by company name or ticker symbol to open its stock page.</p>
      </div>
      <div className="rounded-xl border border-gray-700 bg-gray-900/60 p-6">
        <SearchCommand renderAs="button" label="Search companies and symbols" initialStocks={initialStocks} />
        {initialStocks.length === 0 && (
          <p className="mt-4 text-sm text-gray-400">Popular stocks could not be loaded. Configure FINNHUB_API_KEY in your .env file to enable live search.</p>
        )}
      </div>
    </section>
  );
}
