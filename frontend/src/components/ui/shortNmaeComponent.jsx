"use client";
import React from "react";

const ShortNameComponent = ({ title = "" }) => {
  return (
    <div className="font-bold text-blue-600">
      {title
        ?.split(" ")
        ?.map((word) => word[0])
        ?.join("")
        ?.toUpperCase() || ""}
    </div>
  );
};

export default ShortNameComponent;
