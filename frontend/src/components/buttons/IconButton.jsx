"use client";
import React from "react";

const IconButton = ({ icon, onClick, className = "" }) => {
  const baseClasses = "flex items-center justify-center rounded-lg";

  // Responsive size
  const sizeClasses =
    " text-sm sm:w-8 sm:h-8 sm:text-base md:w-10 md:h-10 md:text-lg lg:w-12 lg:h-12 lg:text-xl";

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${className} hover:bg-sidebar-button-hover`}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

export default IconButton;
