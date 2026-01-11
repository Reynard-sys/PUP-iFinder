"use client";

import Link from "next/link";
import Image from "next/image";
import { CircleUser, Menu, X, Loader2, CheckCircle2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { verifyCode } from "../../app/actions/verifycode";
import { hasUsedCode } from "../../app/actions/hasUsedCode";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [student, setStudent] = useState(null);

  const [showBlockModal, setShowBlockModal] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [codeError, setCodeError] = useState("");

  const [isRegisteringBlockrep, setIsRegisteringBlockrep] = useState(false);
  const [showBlockrepSuccess, setShowBlockrepSuccess] = useState(false);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
    if (storedStudent) setStudent(JSON.parse(storedStudent));
  }, []);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  function openLogoutFlow() {
    setOpen(false);
    setMobileNavOpen(false);
    setShowLogoutConfirm(true);
  }

  async function confirmLogout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    localStorage.removeItem("student");
    setShowLogoutConfirm(false);
    setShowLogoutSuccess(true);
    setIsLoggingOut(false);
  }

  async function handleEnterCode() {
    if (isRegisteringBlockrep) return;

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

    setIsRegisteringBlockrep(true);

    const result = await verifyCode(accessCode.trim(), studentNumber);

    setIsRegisteringBlockrep(false);

    if (result.success) {
      setShowBlockModal(false);
      setShowBlockrepSuccess(true);
      setOpen(false);
      setMobileNavOpen(false);
      setAccessCode("");
      setCodeError("");
    } else {
      setCodeError(result.error);
    }
  }

  const linkClass = (href) =>
    `transition whitespace-nowrap ${
      pathname === href
        ? "text-[#800000] underline underline-offset-4"
        : "text-black hover:text-red-900"
    }`;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm font-poppins">
      {isRegisteringBlockrep && (
        <div className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl px-6 py-6 w-full max-w-sm text-center">
            <div className="flex items-center justify-center">
              <Loader2 className="animate-spin text-[#800000]" size={44} />
            </div>
            <p className="mt-4 text-lg font-bold text-[#800000]">
              Registering…
            </p>
            <p className="mt-1 text-sm text-gray-700">
              Please wait while the access code is being verified.
            </p>
          </div>
        </div>
      )}

      {showBlockrepSuccess && (
        <div className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-[560px] rounded-2xl shadow-2xl px-6 sm:px-10 py-8 sm:py-10 text-center">
            <div className="flex items-center justify-center">
              <CheckCircle2 className="text-green-600" size={54} />
            </div>
            <h2 className="mt-4 text-xl sm:text-3xl font-extrabold text-[#800000]">
              Registration successful
            </h2>
            <p className="mt-2 text-sm sm:text-lg text-gray-700">
              You can now access the Block Representative dashboard.
            </p>

            <button
              onClick={() => {
                setShowBlockrepSuccess(false);
                router.push("/blockrep");
              }}
              className="mt-6 w-full bg-[#800000] text-white text-lg sm:text-xl font-bold py-3.5 sm:py-4 rounded-2xl shadow-md hover:bg-[#660000] transition"
            >
              Continue
            </button>

            <button
              onClick={() => setShowBlockrepSuccess(false)}
              className="mt-4 w-full text-center text-[#800000] font-semibold hover:underline"
            >
              Stay here
            </button>
          </div>
        </div>
      )}

      {showLogoutConfirm && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999] px-4"
          onClick={() => !isLoggingOut && setShowLogoutConfirm(false)}
        >
          <div
            className="bg-white w-full max-w-[560px] rounded-xl shadow-2xl px-5 sm:px-10 py-8 sm:py-10"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-center text-xl sm:text-3xl font-extrabold text-[#800000]">
              Confirm logout
            </h2>
            <p className="text-center text-gray-700 mt-2 text-sm sm:text-lg">
              Are you sure you want to log out of your account?
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
              <button
                disabled={isLoggingOut}
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full border border-[#800000] text-[#800000] py-3 rounded-2xl font-bold hover:bg-[#800000] hover:text-white transition disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                disabled={isLoggingOut}
                onClick={confirmLogout}
                className="w-full bg-[#800000] text-white py-3 rounded-2xl font-bold hover:bg-[#660000] transition disabled:opacity-60"
              >
                {isLoggingOut ? "Logging out..." : "Yes, log out"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showLogoutSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999] px-4">
          <div className="bg-white w-full max-w-[560px] rounded-xl shadow-2xl px-5 sm:px-10 py-8 sm:py-10 text-center">
            <div className="flex items-center justify-center">
              <CheckCircle2 className="text-green-600" size={54} />
            </div>

            <h2 className="mt-4 text-xl sm:text-3xl font-extrabold text-[#800000]">
              Logged out
            </h2>
            <p className="mt-2 text-sm sm:text-lg text-gray-700">
              You have been logged out successfully.
            </p>

            <button
              onClick={() => {
                setShowLogoutSuccess(false);
                router.push("/");
              }}
              className="mt-6 w-full bg-[#800000] text-white text-lg sm:text-xl font-bold py-3.5 sm:py-4 rounded-2xl shadow-md hover:bg-[#660000] transition"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {showBlockModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          onClick={() => {
            if (!isRegisteringBlockrep) setShowBlockModal(false);
          }}
        >
          <div
            className="bg-white w-full max-w-[620px] rounded-xl shadow-2xl px-5 sm:px-10 py-8 sm:py-12 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-center text-xl sm:text-3xl font-extrabold text-[#800000]">
              Block Representative
            </h2>
            <p className="text-center text-gray-700 mt-1 sm:mt-2 text-sm sm:text-lg">
              Enter your access code here
            </p>

            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              disabled={isRegisteringBlockrep}
              className="mt-6 sm:mt-10 w-full border-2 border-[#C4666B] rounded-2xl px-5 sm:px-6 py-3 sm:py-4 text-base sm:text-lg text-black focus:outline-none focus:ring-2 focus:ring-[#800000] disabled:opacity-60"
            />

            {codeError && (
              <p className="mt-2 text-center text-red-700 font-semibold text-sm">
                {codeError}
              </p>
            )}

            <button
              onClick={handleEnterCode}
              disabled={isRegisteringBlockrep}
              className="mt-5 sm:mt-6 w-full bg-[#800000] text-white text-lg sm:text-xl font-bold py-3.5 sm:py-4 rounded-2xl shadow-md hover:bg-[#660000] transition disabled:opacity-60"
            >
              Enter
            </button>

            <button
              onClick={() => {
                if (!isRegisteringBlockrep) setShowBlockModal(false);
              }}
              className="mt-4 sm:mt-6 w-full text-center text-[#800000] font-semibold hover:underline disabled:opacity-60"
              disabled={isRegisteringBlockrep}
            >
              Go back
            </button>
          </div>
        </div>
      )}

      <div className="h-20 md:h-24">
        <div className="h-full flex items-center justify-between px-[7%]">
          <div className="flex items-center gap-3 sm:gap-5 min-w-0 select-none">
            <Image
              src="/PUPLogo.png"
              alt="PUP Logo"
              width={70}
              height={70}
              priority
              className="object-contain shrink-0"
            />
            <span className="text-xl sm:text-3xl md:text-4xl font-bold text-[#800000] leading-none tracking-wide truncate">
              PUP iFinder
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <nav className="hidden md:flex items-center gap-10 text-black font-semibold text-lg">
              <Link href="/studentCOR" className={linkClass("/studentCOR")}>
                COR
              </Link>
              <Link
                href="/studentSubject"
                className={linkClass("/studentSubject")}
              >
                Subject
              </Link>
            </nav>

            <button
              type="button"
              className="md:hidden p-2 rounded-lg bg-white hover:bg-gray-200 transition"
              aria-label="Menu"
              onClick={() => {
                setMobileNavOpen((v) => !v);
                setOpen(false);
              }}
            >
              {mobileNavOpen ? (
                <X size={30} className="text-[#800000]" />
              ) : (
                <Menu size={30} className="text-[#800000]" />
              )}
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setOpen((v) => !v);
                  setMobileNavOpen(false);
                }}
                className="p-1 sm:p-2 rounded-full hover:bg-gray-100 transition"
                aria-label="Profile"
              >
                <CircleUser strokeWidth={0.75} size={56} className="text-black" />
              </button>

              {open && student && (
                <div className="absolute right-0 top-[72px] sm:top-[78px] w-[92vw] max-w-[500px] bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 z-50 max-h-[70vh] overflow-auto">
                  <p className="font-bold text-black text-base sm:text-lg break-all leading-snug">
                    {student?.email}
                  </p>
                  <p className="text-gray-700 text-xs sm:text-sm mt-0.5">
                    {student?.studentNumber}
                  </p>

                  <hr className="my-3 sm:my-5 border-gray-200 border-t" />

                  <p className="text-gray-900 text-sm sm:text-base font-normal leading-snug">
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
                      className="text-[#DAA520] font-normal underline underline-offset-2 hover:text-yellow-600 transition"
                    >
                      Click here.
                    </button>
                  </p>

                  <button
                    onClick={openLogoutFlow}
                    className="mt-4 sm:mt-6 border border-[#800000] text-[#800000] px-4 py-2 rounded-lg font-semibold text-sm sm:text-base hover:bg-[#800000] hover:text-white transition"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {mobileNavOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-[7%] pt-4 pb-6 shadow-sm">
          <div className="flex items-center gap-8 font-semibold">
            <Link href="/studentCOR" className={linkClass("/studentCOR")}>
              COR
            </Link>
            <Link href="/studentSubject" className={linkClass("/studentSubject")}>
              Subject
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
