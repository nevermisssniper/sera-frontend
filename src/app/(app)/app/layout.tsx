import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SideMenu from "@/components/side-menu";
import AppHeader from "@/components/app-header";
import { checkAuth } from "@/lib/server-utils";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Headshot AI dashboard",
  description:
    "Dashboard for HeadshotAI: browse images, save favorites, and create albums of your favorite AI generated headshots.",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await checkAuth();

  return (
    <div className={`${inter.className} flex flex-col min-h-screen`}>
      <div className="flex flex-1">
        <SideMenu />
        <main className="w-full px-4 pt-8 bg-gray-50">{children}</main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
