/**
 * Name, Avatar Component
 * @format
 */
import PropTypes from "prop-types";
import React from "react";
import { MdOutlinePhone } from "react-icons/md";

export default function NameAvatarColumn({
  name,
  description,
  showImage = false,
  showDescription = false,
  showMobile = false,
  mobileNumber,
  imageUrl = "https://img.freepik.com/free-vector/smiling-young-…tion_1308-173524.jpg?semt=ais_incoming&w=740&q=80",
}) {
  return (
    <div className="flex items-center gap-3 px-2 py-1">
      {showImage && (
        <div className="flex-shrink-0">
          <img
            alt={name}
            src={imageUrl}
            className="w-8 h-8 rounded-full object-cover border border-gray-200 shadow-sm"
          />
        </div>
      )}
      <div className="flex flex-col justify-between items-start">
        <span className="text-sm font-medium text-gray-800">{name}</span>
        {showDescription && (
          <span className="text-xs text-gray-500">{description}</span>
        )}
        {showMobile && (
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <MdOutlinePhone size={12} className="text-gray-400" />
            {mobileNumber}
          </span>
        )}
      </div>
    </div>
  );
}

NameAvatarColumn.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  showImage: PropTypes.bool,
  showDescription: PropTypes.bool,
  imageUrl: PropTypes.string,
};
