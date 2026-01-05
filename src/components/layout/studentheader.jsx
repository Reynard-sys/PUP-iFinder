"use client";

import Link from "next/link";
import Image from "next/image";
import { CircleUser } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { verifyCode } from "../../app/actions/verifycode";
import { hasUsedCode } from "../../app/actions/hasUsedCode";

export default function Header() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const [student, setStudent] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [accessCode, setAccessCode] = useState("");

  const [codeError, setCodeError] = useState("");

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    if (storedStudent) {
      setStudent(JSON.parse(storedStudent));
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("student");
    alert("Logged out!");
    router.push("/");
  }

  async function handleEnterCode() {
    setCodeError("");

    if (!accessCode.trim()) {
      setCodeError("Please enter an access code.");
      return;
    }

    const storedStudent = localStorage.getItem("student");
    if (!storedStudent) {
      setCodeError("You must be logged in.");
      return;
    }

    const studentObj = JSON.parse(storedStudent);
    const studentNumber = studentObj.studentNumber;

    const result = await verifyCode(accessCode.trim(), studentNumber);

    if (result.success) {
      setShowBlockModal(false);
      router.push("/blockrep");
    } else {
      setCodeError(result.error);
    }
  }
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm h-20 md:h-24 font-poppins">
      {showBlockModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          onClick={() => setShowBlockModal(false)}
        >
          <div
            className="bg-white w-full max-w-[620px] rounded-xl shadow-2xl px-10 py-12 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-[#800000]">
              Block Representative
            </h2>
            <p className="text-center text-gray-700 mt-2 text-base sm:text-lg">
              Enter your access code here
            </p>

            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder=""
              className="mt-10 w-full border-2 border-[#C4666B] rounded-2xl px-6 py-4 text-lg text-black focus:outline-none focus:ring-2 focus:ring-[#800000]"
            />

            {codeError && (
              <p className="mt-3 text-center text-red-700 font-semibold text-sm">
                {codeError}
              </p>
            )}

            <button
              onClick={handleEnterCode}
              className="mt-6 w-full bg-[#800000] text-white text-xl font-bold py-4 rounded-2xl shadow-md hover:bg-[#660000] transition"
            >
              Enter
            </button>

            <button
              onClick={() => setShowBlockModal(false)}
              className="mt-6 w-full text-center text-[#800000] font-semibold hover:underline"
            >
              Go back
            </button>
          </div>
        </div>
      )}
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
              href="/studentCOR"
              className={`transition ${
                pathname === "/studentCOR"
                  ? "text-[#800000] underline underline-offset-5"
                  : "text-black hover:text-red-900"
              }`}
            >
              COR
            </Link>
            <Link
              href="/studentSubject"
              className={`transition ${
                pathname === "/studentSubject"
                  ? "text-[#800000] underline underline-offset-5"
                  : "text-black hover:text-red-900"
              }`}
            >
              Subject
            </Link>

            <div
              className="ml-auto flex items-center mr-[7%] relative"
              ref={dropdownRef}
            >
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className="p-2 rounded-full hover:bg-gray-100 transition"
                aria-label="Profile"
              >
                <CircleUser
                  strokeWidth={0.75}
                  size={70}
                  className="text-black"
                />
              </button>
              {open && student && (
                <div className="absolute right-0 top-[90px] w-[500px] bg-white rounded-2xl shadow-xl border border-gray-200 p-6 z-50">
                  <p className="font-bold text-black text-lg">
                    {student?.email}
                  </p>
                  <p className="text-gray-700 text-sm">
                    {student?.studentNumber}
                  </p>

                  <hr className="my-5 border-gray-200 border-t-8" />

                  <p className="text-gray-900 text-base font-normal">
                    Block Representative?{" "}
                    <button
                      onClick={async () => {
                        const storedStudent = localStorage.getItem("student");
                        if (!storedStudent) return;

                        const studentObj = JSON.parse(storedStudent);
                        const studentNumber = studentObj.studentNumber;

                        const result = await hasUsedCode(studentNumber);

                        if (result.success && result.used) {
                          router.push("/blockrep");
                          setOpen(false);
                          return;
                        }

                        setShowBlockModal(true);
                        setOpen(false);
                        setAccessCode("");
                        setCodeError("");
                      }}
                      className="text-[#DAA520] font-thin text-base underline underline-offset-2 hover:text-yellow-600 transition"
                    >
                      Click here.
                    </button>
                  </p>

                  <button
                    onClick={handleLogout}
                    className="mt-6 border border-[#800000] text-[#800000] px-4 py-2 rounded-lg font-semibold hover:bg-[#800000] hover:text-white transition"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
