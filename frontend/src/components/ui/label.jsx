"use client";
import React from "react";

const Label = ({ name, className = "" }) => {
  return (
    <label
      htmlFor={name}
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    >
      {name}
    </label>
  );
};

export default Label;
