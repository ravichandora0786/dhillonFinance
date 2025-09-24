/**
 *  Double Paragraph Column Component
 * @format
 */
import React from "react";

export default function DoubleParagraphColumn({ value1, value2 }) {
  return (
    <div className="flex flex-col text-center text-gray-600 text-xs ">
      <span className="text-xs text-center">{value1 || "-"}</span>
      <span className="text-xs text-center">{value2 || "-"}</span>
    </div>
  );
}
