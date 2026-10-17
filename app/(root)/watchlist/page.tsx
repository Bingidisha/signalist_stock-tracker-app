import Link from "next/link";
import { getAuth } from "@/lib/better-auth/auth";
import { getWatchlistSymbolsByEmail } from "@/lib/actions/watchlist.actions";
import { headers } from "next/headers";

export default async function WatchlistPage() {
  let symbols: string[] = [];
  let signedIn = false;
  let databaseReady = true;

  try {
    const auth = await getAuth();
    const session = await auth.api.getSession({ headers: await headers() });
    signedIn = Boolean(session?.user);
    if (session?.user?.email) {
      symbols = await getWatchlistSymbolsByEmail(session.user.email);
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("MONGODB_URI must be set")) {
      databaseReady = false;
    } else {
      throw error;
    }
  }

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6">
      <div>
        <p className="text-sm uppercase tracking-widest text-yellow-500">Your portfolio tools</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">My Watchlist</h1>
        <p className="mt-2 text-gray-400">Keep the stocks you want to follow in one place.</p>
      </div>

      {!databaseReady ? (
        <div className="rounded-xl border border-gray-700 bg-gray-900/60 p-6">
          <h2 className="text-lg font-medium text-white">Connect your database to save stocks</h2>
          <p className="mt-2 text-gray-400">The app is running, but saved watchlists need a MongoDB connection. Add MONGODB_URI to your Codespaces .env file to enable accounts and persistent watchlists.</p>
          <Link href="/sign-in" className="mt-4 inline-block text-yellow-500 hover:underline">Go to sign in</Link>
        </div>
      ) : !signedIn ? (
        <div className="rounded-xl border border-gray-700 bg-gray-900/60 p-6">
          <h2 className="text-lg font-medium text-white">Sign in to use your watchlist</h2>
          <p className="mt-2 text-gray-400">Your saved stocks will appear here after you sign in.</p>
          <Link href="/sign-in" className="mt-4 inline-block text-yellow-500 hover:underline">Sign in</Link>
        </div>
      ) : symbols.length === 0 ? (
        <div className="rounded-xl border border-gray-700 bg-gray-900/60 p-6">
          <h2 className="text-lg font-medium text-white">Your watchlist is empty</h2>
          <p className="mt-2 text-gray-400">Search for a stock and add it to your watchlist to see it here.</p>
          <Link href="/search" className="mt-4 inline-block text-yellow-500 hover:underline">Find stocks</Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-700">
          {symbols.map((symbol) => (
            <Link key={symbol} href={`/stocks/${encodeURIComponent(symbol)}`} className="flex items-center justify-between border-b border-gray-800 p-4 last:border-b-0 hover:bg-gray-900">
              <span className="font-medium text-white">{symbol}</span>
              <span className="text-sm text-yellow-500">View stock →</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
