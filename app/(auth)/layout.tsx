import Link from "next/link";
import Image from "next/image";
import { getAuth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  try {
    const auth = await getAuth();
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user) redirect("/");
  } catch (error) {
    if (!(error instanceof Error && error.message.includes("MONGODB_URI must be set"))) {
      throw error;
    }
  }

  return (
    <main className="auth-layout">
      <section className="auth-left-section scrollbar-hide-default">
        <Link href="/" className="auth-logo">
          <Image src="/assets/icons/logo.svg" alt="Abuk Invest" width={140} height={32} className="h-8 w-auto" />
        </Link>
        <div className="pb-6 lg:pb-8 flex-1">{children}</div>
      </section>
      <section className="auth-right-section">
        <div className="z-10 relative lg:mt-4 lg:mb-16">
          <blockquote className="auth-blockquote">
            Research the market, track your watchlist, and make more informed investment decisions with Abuk Invest.
          </blockquote>
          <div className="flex items-center justify-between">
            <div><cite className="auth-testimonial-author">Abuk Invest</cite><p className="max-md:text-xs text-gray-500">Your market research workspace</p></div>
          </div>
        </div>
        <div className="flex-1 relative">
          <Image src="/assets/images/dashboard.png" alt="Market dashboard preview" width={1440} height={1150} className="auth-dashboard-preview absolute top-0" />
        </div>
      </section>
    </main>
  );
};
export default Layout;
