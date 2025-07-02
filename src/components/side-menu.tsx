"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import clsx from "clsx";

const navItems = [
  {
    href: "/app/dashboard/gallery",
    label: "Gallery",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 15.75l5.159-5.159a2.25 
             2.25 0 013.182 0l5.159 5.159m-1.5-1.5 
             l1.409-1.409a2.25 2.25 0 013.182 0
             l2.909 2.909m-18 3.75h16.5
             a1.5 1.5 0 001.5-1.5V6
             a1.5 1.5 0 00-1.5-1.5H3.75
             A1.5 1.5 0 002.25 6v12a1.5 1.5 
             0 001.5 1.5zm10.5-11.25h.008
             v.008h-.008V8.25zm.375 0
             a.375.375 0 11-.75 0 
             .375.375 0 01.75 0z"
        />
      </svg>
    ),
  },
  {
    href: "/app/dashboard/albums",
    label: "Albums",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 12.75V12
             A2.25 2.25 0 014.5 9.75h15
             A2.25 2.25 0 0121.75 12v.75
             m-8.69-6.44l-2.12-2.12
             a1.5 1.5 0 00-1.061-.44H4.5
             A2.25 2.25 0 002.25 6v12
             a2.25 2.25 0 002.25 2.25
             h15A2.25 2.25 0 0021.75 18
             V9a2.25 2.25 0 00-2.25-2.25
             h-5.379a1.5 1.5 0 01-1.06-.44z"
        />
      </svg>
    ),
  },
  {
    href: "/app/dashboard/favorites",
    label: "Favorites",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.862 3.487c1.79.6 
             3.117 2.233 3.368 4.097.314 2.274-.512 
             4.04-2.368 5.775-1.545 1.394-3.926 
             3.124-5.33 4.16l-.168.125-.168-.125c-1.403-1.035-3.784-2.765-5.33-4.16-1.856-1.735-2.682-3.501-2.368-5.775.251-1.864 
             1.578-3.498 3.368-4.097A4.615 4.615 0 0112 4.856c.907-1.152 
             2.263-1.73 3.862-1.369z"
        />
      </svg>
    ),
  },
];

export default function SideMenu() {
  const pathname = usePathname();

  return (
    <div className="pb-12 w-1/5 bg-white border-r border-white/10 min-h-screen flex flex-col">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Manage
          </h2>
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Button
                  asChild
                  variant={isActive ? "secondary" : "ghost"}
                  className={clsx(
                    "w-full justify-start flex gap-2 text-left",
                    isActive && "bg-gray-100 hover:bg-gray-200"
                  )}
                  key={item.href}
                >
                  <Link href={item.href}>
                    {item.icon}
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-3 py-4 mt-auto">
        <Button
          asChild
          variant="ghost"
          className="w-full justify-start flex gap-2 text-left"
        >
          <Link href="/app/account">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 5.25a3.75 3.75 0 11-7.5 
                   0 3.75 3.75 0 017.5 0zM4.5 20.25v-.75
                   a4.5 4.5 0 014.5-4.5h6a4.5 4.5 0 
                   014.5 4.5v.75"
              />
            </svg>
            Account
          </Link>
        </Button>
      </div>
    </div>
  );
}
