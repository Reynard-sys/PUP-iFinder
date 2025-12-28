"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/20 backdrop-blur-md shadow-sm h-20 md:h-24 font-poppins transition-all duration-300">
      <div className="flex items-center justify-between h-full max-w-[90rem] mx-auto px-2 sm:px-6 md:px-8 lg:px-0">
        <Link href="/" className="flex items-center gap-3 sm:gap-5">
          <Image
            src="/PUPLogo.png"
            alt="PUP Logo"
            width={55}
            height={55}
            priority
            className="object-contain"
          />
          <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-none tracking-wide">
            PUP iFinder
          </span>
        </Link>

        <nav className="hidden md:flex gap-10 lg:gap-16 text-white font-semibold text-base lg:text-lg">
          <a href="#home" className="hover:text-yellow-300 transition">
            Home
          </a>
          <a href="#about" className="hover:text-yellow-300 transition">
            About
          </a>
          <a href="#FAQs" className="hover:text-yellow-300 transition">
            FAQs
          </a>
          <a href="#contact" className="hover:text-yellow-300 transition">
            Contact
          </a>
        </nav>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-[#800000] bg-opacity-95 backdrop-blur-md shadow-lg flex flex-col items-center py-8 space-y-6 text-white font-semibold text-lg transition-all">
          <a
            href="#home"
            onClick={() => setMenuOpen(false)}
            className="hover:text-yellow-400 transition"
          >
            Home
          </a>
          <a
            href="#about"
            onClick={() => setMenuOpen(false)}
            className="hover:text-yellow-400 transition"
          >
            About
          </a>
          <a
            href="#FAQs"
            onClick={() => setMenuOpen(false)}
            className="hover:text-yellow-400 transition"
          >
            FAQs
          </a>
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="hover:text-yellow-400 transition"
          >
            Contact
          </a>
        </div>
      )}
    </header>
  );
}
