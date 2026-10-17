'use client';

import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, UserRound } from "lucide-react";
import NavItems from "@/components/NavItems";
import { signOut } from "@/lib/actions/auth.actions";

const UserDropdown = ({ user, initialStocks }: { user?: User; initialStocks: StockWithWatchlistStatus[] }) => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/sign-in" className="text-sm text-gray-300 hover:text-yellow-500">Sign in</Link>
        <Link href="/sign-up" className="rounded-md bg-yellow-500 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-400">Create account</Link>
        <div className="sm:hidden"><NavItems initialStocks={initialStocks} /></div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-3 text-gray-4 hover:text-yellow-500">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" />
            <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">{user.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-base font-medium text-gray-400">{user.name}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="text-gray-400">
        <DropdownMenuLabel>
          <div className="flex items-center gap-3 py-2">
            <Avatar className="h-10 w-10"><AvatarFallback className="bg-yellow-500 text-yellow-900"><UserRound /></AvatarFallback></Avatar>
            <div className="flex flex-col">
              <span className="text-base font-medium text-gray-400">{user.name}</span>
              <span className="text-sm text-gray-500">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-600" />
        <DropdownMenuItem onClick={handleSignOut} className="text-gray-100 text-md font-medium cursor-pointer">
          <LogOut className="h-4 w-4 mr-2" /> Logout
        </DropdownMenuItem>
        <DropdownMenuSeparator className="hidden sm:block bg-gray-600" />
        <nav className="sm:hidden"><NavItems initialStocks={initialStocks} /></nav>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
