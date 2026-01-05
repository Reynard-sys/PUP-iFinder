"use client";

import Header from "../../components/layout/normalHeader";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { facLogin } from "../actions/facultylogin";
import { useState } from "react";

export default function FacultyLogin() {
  const router = useRouter();

  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [errorMsg, setErrorMsg] = useState("");
  const [showErrorBox, setShowErrorBox] = useState(false);

  async function handleLogin(formData) {
    if (attemptsLeft <= 0) {
      setErrorMsg(
        "You have reached the maximum login attempts. Please try again later."
      );
      setShowErrorBox(true);
      return;
    }

    const result = await facLogin(formData);

    if (result.success) {
      localStorage.setItem("faculty", JSON.stringify(result.faculty));
      alert("Login successful!");
      router.push("/faculty");
    } else {
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
  }

  return (
    <>
      <Header />
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
