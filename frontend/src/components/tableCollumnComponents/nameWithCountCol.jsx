/**
 *  name List Columns Component
 * @format
 */
import React, { useState } from "react";

export default function NameWithCountColumnsComponent({ nameList }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleAttendee = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="text-center text-gray-600 text-xs">
      <div className="flex px-2 py-1">
        <div className="flex flex-col justify-center w-full">
          <div className="flex flex-row justify-end items-center">
            <div className="text-xs text-gray-600">{nameList?.[0]}</div>
            {nameList?.length > 1 && (
              <button
                type="button"
                className="ml-2 px-2 py-1 text-xs font-medium bg-gray-200 text-gray-600 rounded hover:bg-gray-300 transition"
                onClick={toggleAttendee}
              >
                +{nameList?.length - 1}
              </button>
            )}
          </div>

          {isOpen && (
            <div className="mt-1 text-xs text-left text-gray-600">
              {nameList?.slice(1).join(", ")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
