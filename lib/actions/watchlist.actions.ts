'use server';

import { connectToDatabase } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.model';
import { getAuth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
  if (!email) return [];
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');
    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });
    if (!user) return [];
    const userId = (user.id as string) || String(user._id || '');
    if (!userId) return [];
    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((item) => String(item.symbol));
  } catch (err) {
    console.error('getWatchlistSymbolsByEmail error:', err);
    return [];
  }
}

export async function setWatchlistStatus(symbol: string, company: string, added: boolean) {
  try {
    const auth = await getAuth();
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.email) return { success: false, error: 'Sign in to save a watchlist.' };

    const normalizedSymbol = symbol.trim().toUpperCase();
    if (!normalizedSymbol) return { success: false, error: 'A stock symbol is required.' };

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');
    const dbUser = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email: session.user.email });
    if (!dbUser) return { success: false, error: 'Your account could not be found in the database.' };
    const userId = dbUser.id || String(dbUser._id || session.user.id);
    if (!userId) return { success: false, error: 'Your account ID could not be found.' };

    if (added) {
      await Watchlist.findOneAndUpdate(
        { userId, symbol: normalizedSymbol },
        { $set: { company: company.trim() || normalizedSymbol }, $setOnInsert: { userId, symbol: normalizedSymbol, addedAt: new Date() } },
        { upsert: true, new: true }
      );
    } else {
      await Watchlist.deleteOne({ userId, symbol: normalizedSymbol });
    }
    return { success: true };
  } catch (error) {
    console.error('setWatchlistStatus error:', error);
    return { success: false, error: error instanceof Error && error.message.includes('MONGODB_URI') ? 'Configure MongoDB to save your watchlist.' : 'Could not update your watchlist.' };
  }
}
