"use client";

import Link from "next/link";
import Image from "next/image";
import { CircleUser } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm h-20 md:h-24 font-poppins">
      <div className="flex items-center h-full w-full pl-[7%]">
        <Link href="/" className="flex items-center gap-3 sm:gap-5">
          <Image
            src="/PUPLogo.png"
            alt="PUP Logo"
            width={70}
            height={70}
            priority
            className="object-contain"
          />
          <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#800000] leading-none tracking-wide">
            PUP iFinder
          </span>
        </Link>
        <div className="ml-auto flex items-center mr-[7%]">
          <div className="flex items-center gap-30 text-black font-semibold text-base md:text-lg">
            <Link
              href="/profile"
              className="p-2 rounded-full hover:bg-gray-100 transition"
              aria-label="Profile"
            >
              <CircleUser
                strokeWidth={0.75}
                size={70}
                className="text-[#000000]"
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
