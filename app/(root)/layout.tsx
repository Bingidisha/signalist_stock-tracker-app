import Header from "@/components/Header";
import { getAuth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// This layout reads the current session and connects to MongoDB. It must run
// for each request, not during Next.js static prerendering at build time.
export const dynamic = "force-dynamic";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  // Keep the original authentication/database requirement. The dashboard must
  // not silently bypass login when MongoDB is missing.
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) redirect("/sign-in");

  const user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
  };

  return (
    <main className="min-h-screen text-gray-400">
      <Header user={user} />
      <div className="container py-10">{children}</div>
    </main>
  );
};

export default Layout;
