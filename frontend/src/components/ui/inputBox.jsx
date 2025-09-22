"use client";
import React from "react";

const InputBox = ({
  type = "text",
  error,
  className = "",
  touched,
  ...props
}) => {
  return (
    <div className={`flex flex-col w-full`}>
      <input
        type={type}
        className={`flex h-10 w-full rounded-md  border ${
          touched && error
            ? "border-danger ring-offset-danger hover:border-danger focus-visible:ring-danger"
            : "border-gray ring-offset-primary hover:border-primary focus-visible:ring-primary"
        } 
          bg-white px-3 py-2 text-base  file:border-0 file:bg-transparent 
          file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground 
          focus-visible:outline-none focus-visible:ring-2 
          focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${className}`}
        {...props}
      />
      {touched && error && (
        <div className="mt-1 text-xs text-danger">{error}</div>
      )}
    </div>
  );
};

export default InputBox;
