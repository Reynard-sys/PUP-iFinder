"use client";

import Header from "../../components/layout/normalHeader";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerStudent } from "../actions/register";
import { useState } from "react";

export default function StudentSignUp() {
  const router = useRouter();

  const [studentNumber, setStudentNumber] = useState("");
  const [errors, setErrors] = useState([]);
  const [showErrorBox, setShowErrorBox] = useState(false);

  function handleStudentNumber(e) {
    let value = e.target.value.toUpperCase(); 
    value = value.replace(/[^0-9MN-]/g, "");
    setStudentNumber(value.slice(0, 15));
  }

  async function handleAction(formData) {
    const newErrors = [];

    const studentNumber = formData.get("studentNumber");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    const studentNumberRegex = /^20\d{2}-\d{5}-[MN]{2}-\d$/;
    if (!studentNumberRegex.test(studentNumber)) {
      newErrors.push("Invalid student number format: 20XX-XXXXX-MN-X");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.push("Invalid email address.");
    }

    if (password !== confirmPassword) {
      newErrors.push("Passwords do not match.");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setShowErrorBox(true);
      return;
    }

    const result = await registerStudent(formData);

    if (result.success) {
      alert("Registration Successful!");
      router.push("/studentHome");
    } else {
      setErrors([result.error]);
      setShowErrorBox(true);
    }
  }
  return (
    <>
      <Header />
      {showErrorBox && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-red-800 mb-4 text-center">
              Please fix the following:
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-[#696984] text-sm">
              {errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>

            <button
              onClick={() => setShowErrorBox(false)}
              className="mt-6 w-full bg-red-800 text-white py-2 rounded-xl font-bold hover:bg-red-900 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <main className="min-h-screen bg-[#8B0000] pt-28 md:pt-32 pb-12 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="bg-white w-full max-w-[95%] sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto rounded-2xl sm:rounded-3xl px-8 sm:px-12 md:px-16 lg:px-20 py-6 sm:py-8 md:py-10 lg:py-12 shadow-2xl">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#8B0000] mb-2 text-center">
            Create Account
          </h2>
          <p className="text-center text-sm sm:text-base md:text-lg mb-6 sm:mb-8 md:mb-10 text-black">
            Check your subject information now
          </p>

          <form action={handleAction} className="flex flex-col gap-5 sm:gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-16 gap-y-5 sm:gap-y-6">
              <div className="flex flex-col">
                <label
                  htmlFor="name"
                  className="text-sm sm:text-base font-normal text-[#8B0000] mb-2"
                >
                  Name (Surname, First Name M.I.)
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Name"
                  className="border border-[#C4666B] rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="studentNumber"
                  className="text-sm sm:text-base font-normal text-[#8B0000] mb-2"
                >
                  Student Number
                </label>
                <input
                  id="studentNumber"
                  name="studentNumber"
                  type="text"
                  placeholder="20XX-XXXXX-MN-X"
                  value={studentNumber}
                  onChange={handleStudentNumber}
                  maxLength={15}
                  className="border border-[#C4666B] rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="email"
                  className="text-sm sm:text-base font-normal text-[#8B0000] mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="border border-[#C4666B] rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="studentType"
                  className="text-sm sm:text-base font-normal text-[#8B0000] mb-2"
                >
                  Student Type
                </label>
                <div className="relative">
                  <select
                    id="studentType"
                    name="studentType"
                    defaultValue="irregular"
                    className="w-full border border-[#C4666B] rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 pr-10 sm:pr-12 text-sm sm:text-base text-[#DC143C] appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#8B0000] cursor-pointer transition"
                  >
                    <option value="irregular">Irregular</option>
                    <option value="regular">Regular</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 sm:right-5 flex items-center pointer-events-none text-[#8B0000] text-xs sm:text-sm">
                    ▼
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="password"
                  className="text-sm sm:text-base font-normal text-[#8B0000] mb-2"
                >
                  Enter password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="border border-[#C4666B] rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm sm:text-base font-normal text-[#8B0000] mb-2"
                >
                  Re-enter password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  className="border border-[#C4666B] rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-[#8B0000] text-white py-3 sm:py-3.5 md:py-4 px-12 sm:px-16 md:px-20 lg:px-24 rounded-2xl font-bold text-base sm:text-lg md:text-xl hover:bg-[#6B0000] active:scale-95 transition-all shadow-lg w-full sm:w-auto max-w-sm mx-auto mt-4 sm:mt-6 md:mt-8"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-4 sm:mt-5 text-center text-xs sm:text-sm text-[#8B0000]">
            Already have an account?{" "}
            <Link
              href="/studentHome"
              className="text-[#DAA520] font-medium hover:underline transition"
            >
              Log in here.
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
