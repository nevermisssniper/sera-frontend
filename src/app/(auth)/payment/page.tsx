"use client";

import { createCheckoutSession } from "@/actions/actions";
import H1 from "@/components/h1";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [isPending, startTransition] = useTransition();
  const { data: session, update, status } = useSession();
  const router = useRouter();

  // Add local state for status or error
  const [genStatus, setGenStatus] = useState<string | null>(null);

  async function handleGenerate() {
    setGenStatus(null);
    try {
      // We do a POST to our new API route
      const res = await fetch("/api/generate-headshots", {
        method: "POST",
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed with status ${res.status}: ${errorText}`);
      }
      const data = await res.json();
      setGenStatus(data.message || "Success!");
    } catch (err: any) {
      console.error(err);
      setGenStatus(err.message);
    }
  }

  return (
    <main className="flex flex-col items-center space-y-10">
      <Logo />
      {searchParams.success && (
        <H1>Success! You now have access to your dashboard.</H1>
      )}
      {searchParams.cancelled && <H1>Headshot AI access requires payment</H1>}
      {!searchParams.success && !searchParams.cancelled && (
        <H1>Last Step! Headshot AI access requires payment</H1>
      )}

      {searchParams.success && (
        <Button
          onClick={async () => {
            // 1) Optionally re-check user session
            await update(true);

            // 2) Call the new function
            await handleGenerate();

            // 3) Then proceed to gallery
            router.push("/app/dashboard/gallery");
          }}
          disabled={status === "loading" || session?.user.hasAccess}
        >
          View my Headshots
        </Button>
      )}

      {!searchParams.success && (
        <Button
          disabled={isPending}
          onClick={async () => {
            startTransition(async () => {
              await createCheckoutSession();
            });
          }}
        >
          Buy lifetime access for $19.99
        </Button>
      )}

      {searchParams.success && (
        <p className="text-sm text-green-700">
          Payment successful! You now have lifetime access to Headshot-ai.
        </p>
      )}
      {searchParams.cancelled && (
        <p className="text-sm text-red-700">
          Payment cancelled. You can try again.
        </p>
      )}

      {genStatus && <p>{genStatus}</p>}
    </main>
  );
}
