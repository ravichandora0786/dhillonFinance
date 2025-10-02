// src/app/not-found.tsx
"use client";

import "./globals.css";
import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <div className="text-gray-900">
          <div className="flex flex-col justify-between min-h-screen">
            {/* Header */}
            <header className="shadow-md py-2 px-4 bg-white">
              <h3 className=" font-semibold">My App</h3>
            </header>

            {/* 404 Section */}
            <div className="flex flex-1 items-center justify-center px-4">
              <div className="text-center">
                <h1 className="text-9xl font-extrabold text-primary">404</h1>
                <p className="text-2xl font-semibold mt-6">
                  Oops! Page not found
                </p>
                <p className="mt-4 mb-8 text-gray-600">
                  {`The page you're looking for doesn't exist or has been moved.`}
                </p>
                <Link
                  href="/dashboard"
                  className="inline-block px-6 py-3 bg-primary text-white font-medium rounded-full shadow-md"
                >
                  Go Home
                </Link>
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
