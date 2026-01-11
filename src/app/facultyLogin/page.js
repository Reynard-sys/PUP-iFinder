"use client";

import Header from "../../components/layout/normalHeader";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { facLogin } from "../actions/facultylogin";
import { useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function FacultyLogin() {
  const router = useRouter();

  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [errorMsg, setErrorMsg] = useState("");
  const [showErrorBox, setShowErrorBox] = useState(false);

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);

  useEffect(() => {
    if (!showLoginSuccess) return;
    const t = setTimeout(() => {
      setShowLoginSuccess(false);
      router.push("/faculty");
    }, 1200);
    return () => clearTimeout(t);
  }, [showLoginSuccess, router]);

  async function handleLogin(formData) {
    if (isLoggingIn) return;

    if (attemptsLeft <= 0) {
      setErrorMsg(
        "You have reached the maximum login attempts. Please try again later."
      );
      setShowErrorBox(true);
      return;
    }

    setIsLoggingIn(true);

    const result = await facLogin(formData);

    if (result.success) {
      localStorage.setItem("faculty", JSON.stringify(result.faculty));
      setShowLoginSuccess(true);
      setIsLoggingIn(false);
      return;
    }

    setIsLoggingIn(false);

    const newAttempts = attemptsLeft - 1;
    setAttemptsLeft(newAttempts);

    if (newAttempts > 0) {
      setErrorMsg(
        `Incorrect login credentials (Attempt/s remaining: ${newAttempts})`
      );
    } else {
      setErrorMsg("Too many failed attempts. Please try again later.");
    }

    setShowErrorBox(true);
  }

  return (
    <>
      <Header />

      {isLoggingIn && (
        <div className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl px-6 py-6 w-full max-w-sm text-center">
            <div className="flex items-center justify-center">
              <Loader2 className="animate-spin text-[#800000]" size={44} />
            </div>
            <p className="mt-4 text-lg font-bold text-[#800000]">Signing in…</p>
            <p className="mt-1 text-sm text-gray-700">
              Please wait while the system logs you in.
            </p>
          </div>
        </div>
      )}

      {showLoginSuccess && (
        <div className="fixed inset-0 z-[999] bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-[560px] rounded-xl shadow-2xl px-5 sm:px-10 py-8 sm:py-10 text-center">
            <div className="flex items-center justify-center">
              <CheckCircle2 className="text-green-600" size={54} />
            </div>

            <h2 className="mt-4 text-xl sm:text-3xl font-extrabold text-[#800000]">
              Login successful
            </h2>
            <p className="mt-2 text-sm sm:text-lg text-gray-700">
              Redirecting to your dashboard…
            </p>
          </div>
        </div>
      )}

      {showErrorBox && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-red-800 mb-3 text-center">
              Login Failed
            </h2>

            <p className="text-center text-[#696984] text-sm">{errorMsg}</p>

            <button
              onClick={() => setShowErrorBox(false)}
              className="mt-5 w-full bg-red-900 text-white py-2 rounded-xl font-bold hover:bg-red-950 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <main className="min-h-screen bg-[#800000] pt-8 md:pt-12 flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-9 shadow-lg w-full max-w-[90%] sm:max-w-[400px] md:max-w-[500px] mx-auto">
          <h2 className="text-xl font-bold text-[#800000] text-center">
            Log in as Faculty
          </h2>
          <p className="text-center text-base sm:text-base mb-10 text-black">
            Sign in to your account
          </p>

          <form action={handleLogin} className="flex flex-col gap-6 sm:gap-8">
            <div className="flex flex-col text-left">
              <label
                htmlFor="facultyNumber"
                className="text-base sm:text-lg font-medium text-[#800000] mb-1"
              >
                Faculty Number
              </label>
              <input
                id="facultyNumber"
                name="facultyNumber"
                maxLength={12}
                type="text"
                placeholder="Enter your faculty number"
                className="border border-[#800000] rounded-lg px-4 py-3 sm:py-4 focus:outline-none focus:ring-2 focus:ring-[#800000]/40 text-black"
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
                name="password"
                placeholder="Enter your password"
                className="border border-[#800000] rounded-lg px-4 py-3 sm:py-4 focus:outline-none focus:ring-2 focus:ring-[#800000]/40 text-black"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn || showLoginSuccess}
              className="bg-[#800000] text-white py-3 sm:py-4 rounded-lg font-bold mt-2 text-lg hover:bg-[#660000] transition disabled:opacity-60"
            >
              Log In
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#800000]">
            Not Faculty?{" "}
            <Link href="/" className="text-yellow-500 font-medium hover:underline">
              Go back to Home Page.
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
