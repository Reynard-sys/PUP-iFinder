"use client";

import Header from "../../components/layout/normalHeader";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function FacultyLogin() {
  const router = useRouter();

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#800000] pt-8 md:pt-12 flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-9 shadow-lg w-full max-w-[90%] sm:max-w-[400px] md:max-w-[500px] mx-auto">
          <h2 className="text-xl font-bold text-[#800000] text-center">
            Log in as Faculty
          </h2>
          <p className="text-center text-base sm:text-base mb-10 text-black">
            Sign in to your account
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              router.push("/faculty");
            }}
            className="flex flex-col gap-6 sm:gap-8"
          >
            <div className="flex flex-col text-left">
              <label
                htmlFor="facultyNumber"
                className="text-base sm:text-lg font-medium text-[#800000] mb-1"
              >
                Faculty Number
              </label>
              <input
                id="facultyNumber"
                type="text"
                placeholder="Enter your faculty number"
                className="border border-[#800000] rounded-lg px-4 py-3 sm:py-4 focus:outline-none focus:ring-2 focus:ring-[#800000]/40"
              />
            </div>

            <div className="flex flex-col text-left">
              <label
                htmlFor="password"
                className="text-base sm:text-lg font-medium text-[#800000] mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="border border-[#800000] rounded-lg px-4 py-3 sm:py-4 focus:outline-none focus:ring-2 focus:ring-[#800000]/40"
              />
            </div>

            <button
              type="submit"
              className="bg-[#800000] text-white py-3 sm:py-4 rounded-lg font-bold mt-2 text-lg hover:bg-[#660000] transition"
            >
              Log In
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#800000]">
            Not Faculty?{" "}
            <Link
              href="/"
              className="text-yellow-500 font-medium hover:underline"
            >
              Go back to Home Page.
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
