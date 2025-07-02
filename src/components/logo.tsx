import Image from "next/image";
import logo from "../../public/logo.svg";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Logo({
  className,
}: {
  className?: string | undefined;
}) {
  return (
    <Link href="/" className={cn("flex items-center", className)}>
      <Image src={logo} alt="Headshot AI logo" className="h-8 w-auto" />
    </Link>
  );
}
