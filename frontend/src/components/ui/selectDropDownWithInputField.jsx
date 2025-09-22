"use client";
import React, { useState, useEffect, useRef } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function SelectDropDownWithInputField({
  options = [],
  inputPlaceholder = "Filter by",
  handleInputChange = () => {},
  handleKeySelect = () => {},
  inputValue = "",
  keyName = "",
  selectedkeyIndex = null,
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="relative inline-flex  border border-gray-300 rounded-lg shadow-sm bg-white"
      ref={dropdownRef}
    >
      {/* Input */}
      <input
        type="text"
        className="flex-1 px-3 py-2 text-sm rounded-l-lg 
                   border-0 focus:ring-2 focus:ring-primary focus:outline-none 
                   focus:border-primary text-gray-800"
        placeholder={inputPlaceholder}
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
      />

      {/* Dropdown Button */}
      <button
        type="button"
        className="px-2 border-l border-gray-300 flex items-center justify-center align-middle
                   text-text2 hover:bg-hover rounded-r-lg focus:outline-none 
                   focus:ring-2 focus:ring-primary"
        onClick={() => setOpen((prev) => !prev)}
      >
        {keyName && (
          <span className="mr-1 text-sm">
            {keyName.charAt(0).toUpperCase() + keyName.slice(1)}
          </span>
        )}
        <KeyboardArrowDownIcon fontSize="small" className="text-primary" />
      </button>

      {/* Dropdown List */}
      {open && (
        <ul className="absolute right-0 top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-auto">
          {options.length ? (
            options.map((option, index) => (
              <li
                key={index}
                className={`px-3 py-2 text-sm cursor-pointer hover:bg-button-active 
                  ${
                    selectedkeyIndex === index
                      ? "bg-active-bg font-medium text-active-text"
                      : ""
                  }`}
                onClick={() => handleKeySelect(option, "", index)}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-sm text-gray-400">No options</li>
          )}
        </ul>
      )}
    </div>
  );
}
