"use client";
import React from "react";

const TitleAndDescription = ({ title = "", description = "" }) => {
  return (
    <div className="flex flex-col">
      {/* Title */}
      <div className="text-lg font-semibold text-text2">{title}</div>

      {/* Description */}
      <div className="text-sm text-text2">{description}</div>
    </div>
  );
};

export default TitleAndDescription;
