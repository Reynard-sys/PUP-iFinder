"use client";

import Header from "../components/layout/normalHeader";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#800000] pt-20 md:pt-24 flex flex-col items-center text-center px-6">
        <div className="mt-30">
          <h1 className="text-6xl sm:text-5xl md:text-6xl font-extrabold text-white">
            Welcome to PUP iFinder!
          </h1>

          <p className="mt-5 text-base sm:text-lg md:text-2xl text-white/90 max-w-3xl leading-relaxed">
            The official subject information portal for students. Find your
            class information easily, at one tap.
          </p>
        </div>

        <p className="mt-50 text-white text-2xl sm:text-lg md:text-2xl">
          Please click or tap your destination.
        </p>

        <div className="mt-6 flex flex-col gap-4 w-full max-w-lg">
          <Link
            href="/studentHome"
            className="w-full bg-white text-[#800000] font-bold text-lg py-3 rounded-xl shadow-md hover:bg-gray-100 transition text-center"
          >
            Student
          </Link>

          <Link
            href="/facultyLogin"
            className="w-full bg-[#FFD700] text-black font-bold text-lg py-3 rounded-xl shadow-md hover:bg-yellow-400 transition text-center"
          >
            Faculty
          </Link>
        </div>
      </main>
    </>
  );
}
