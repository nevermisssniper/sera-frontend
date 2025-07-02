import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import HomeFooter from "@/components/homePage/home-footer";
import Navbar from "@/components/homePage/navbar";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Headshot-ai | Professional AI-Generated Headshots",
  description:
    "Get professional AI-generated headshots quickly and affordably with Headshot-ai.",
  keywords:
    "AI headshots, professional headshots, AI-generated images, affordable headshots",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* 
        A subtle, light background that complements a blue accent.
        You can experiment with using a lighter or darker background. 
      */}
      <body
        className={`${inter.className} flex flex-col text-sm min-h-screen text-zinc-900 bg-white`}
      >
        <SessionProvider>
          <Navbar />
          <Suspense fallback={<p>Loading profile...</p>}>
            <main className="flex flex-col flex-1 pt-16">{children}</main>
          </Suspense>
        </SessionProvider>
        <HomeFooter />
      </body>
    </html>
  );
}
