"use client";
import React from "react";
import Image from "next/image";

const CustomImageComponent = ({
  width = 50,
  height = 50,
  imageUrl = "https://img.freepik.com/free-vector/smiling-young-…tion_1308-173524.jpg?semt=ais_incoming&w=740&q=80",
  alt = "img",
  className,
}) => {
  return (
    <Image
      alt={alt}
      src={imageUrl}
      width={width}
      height={height}
      className={className}
    />
  );
};

export default CustomImageComponent;
