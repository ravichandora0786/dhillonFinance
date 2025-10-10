// src/app/not-found.tsx
"use client";

import LoadingButton from "@/components/ui/loadingButton";
import "./globals.css";
import Link from "next/link";
import { TfiHome } from "react-icons/tfi";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Dhillon Finance</title>
      </head>
      <body>
        <div className="text-gray-900">
          <div className="flex flex-col justify-between min-h-screen">
            {/* Header */}
            <header className="w-full z-50 fixed bg-primary/70 shadow px-4 py-1 flex justify-between items-center">
              {/* Left - Logo */}
              <div className="text-xl font-bold text-black cursor-pointer">
                Dhillon Finance
              </div>

              {/* Right - Profile Section */}
              <div className="relative flex items-center gap-2">
                <div className="">
                  <LoadingButton
                    type="button"
                    isLoading={false}
                    disabled={false}
                    variant={"custom"}
                    className="px-0 py-2"
                    onClick={() => {
                      router.back();
                    }}
                  >
                    <TfiHome className="" />
                  </LoadingButton>
                </div>
              </div>
            </header>

            {/* 404 Section */}
            <div className="flex flex-1 items-center justify-center px-4">
              <div className="flex flex-col justify-between items-center text-center">
                <h1 className="text-9xl font-extrabold text-primary">404</h1>
                <p className="text-2xl font-semibold mt-6">
                  Oops! Page not found
                </p>
                <p className="mt-4 mb-8 text-gray-600">
                  {`The page you're looking for doesn't exist or has been moved.`}
                </p>
                <div className="w-50">
                  <LoadingButton
                    type="button"
                    isLoading={false}
                    disabled={false}
                    variant={"primary"}
                    onClick={() => {
                      router.back();
                    }}
                  >
                    Go Back
                  </LoadingButton>
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer className="py-4 text-center text-sm text-gray-500 border-t">
              © {new Date().getFullYear()} My App. All rights reserved.
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
