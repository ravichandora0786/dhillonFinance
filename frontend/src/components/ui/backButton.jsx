"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";

const BackButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex flex-row gap-1 justify-center items-center text-gray-700"
    >
      <HiOutlineArrowNarrowLeft size={18} /> Back
    </button>
  );
};

export default BackButton;
