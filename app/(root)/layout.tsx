import Header from "@/components/Header";
import { getAuth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  try {
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
  } catch (error) {
    if (error instanceof Error && error.message.includes("MONGODB_URI must be set")) {
      return (
        <main className="min-h-screen text-gray-400">
          <Header />
          <div className="container py-10">{children}</div>
        </main>
      );
    }
    throw error;
  }
};

export default Layout;
