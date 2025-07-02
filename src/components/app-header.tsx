"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logo from "@/public/logo.png"; // Replace with your actual logo image
import Logo from "./logo";

export default function AppHeader({ userEmail }: { userEmail: string }) {
  const activePathname = usePathname();

  // Function to extract the first alphabetic character
  const getFirstAlphabeticChar = (email: string): string => {
    const match = email.match(/[A-Za-z]/);
    return match ? match[0].toLocaleUpperCase() : "?";
  };

  const firstLetter = getFirstAlphabeticChar(userEmail);

  return (
    <header className="flex justify-between items-center border-b border-white/10 py-2 px-4 bg-white shadow-sm">
      <Logo />

      <Link href="/account" className="ml-4">
        <Avatar>
          <AvatarImage alt="@username" />
          <AvatarFallback>{firstLetter}</AvatarFallback>
        </Avatar>
      </Link>
    </header>
  );
}
