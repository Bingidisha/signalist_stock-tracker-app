import Link from "next/link";
import Image from "next/image";
import NavItems from "@/components/NavItems";
import UserDropdown from "@/components/UserDropdown";
import { searchStocks } from "@/lib/actions/finnhub.actions";

const Header = async ({ user }: { user?: User }) => {
  let initialStocks: StockWithWatchlistStatus[] = [];
  try {
    initialStocks = await searchStocks();
  } catch {
    // Search can still open when a market-data key has not been configured.
  }

  return (
    <header className="sticky top-0 header">
      <div className="container header-wrapper">
        <Link href="/" aria-label="Abuk Invest home" className="flex items-center gap-2">
          <Image src="/assets/icons/logo.svg" alt="Abuk Invest" width={140} height={32} className="h-8 w-auto cursor-pointer" />
        </Link>
        <nav className="hidden sm:block">
          <NavItems initialStocks={initialStocks} />
        </nav>
        <UserDropdown user={user} initialStocks={initialStocks} />
      </div>
    </header>
  );
};

export default Header;
