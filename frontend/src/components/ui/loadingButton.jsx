"use client";
import React from "react";
import clsx from "clsx";

const LoadingButton = ({
  children,
  isLoading = false,
  disabled = false,
  className = "",
  variant = "primary",
  ...props
}) => {
  const baseClasses = `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md 
        text-sm font-semibold transition-colors focus-visible:outline-none 
        focus-visible:ring-2 focus-visible:ring-primary/50 
        disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
        px-4 py-2`;

  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary-hover w-full",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-700",
    danger: "bg-danger text-white hover:bg-danger",
    custom: className,
  };
  return (
    <button
      disabled={isLoading || disabled}
      className={clsx(baseClasses, variantClasses[variant])}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      {isLoading ? "Please wait..." : children}
    </button>
  );
};

export default LoadingButton;
