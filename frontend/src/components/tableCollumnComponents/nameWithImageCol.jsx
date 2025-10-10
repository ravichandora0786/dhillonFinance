/**
 * Name, Avatar Component
 * @format
 */
import PropTypes from "prop-types";
import React from "react";
import { MdOutlinePhone } from "react-icons/md";
import CustomImageComponent from "@/components/ui/customImageComponent";

export default function NameAvatarColumn({
  name,
  description,
  showImage = false,
  showDescription = false,
  showMobile = false,
  mobileNumber,
  imageUrl,
}) {
  return (
    <div className="flex items-center gap-3 px-2 py-1">
      {showImage && (
        <div className="flex-shrink-0">
          <CustomImageComponent
            alt={name}
            imageUrl={imageUrl}
            className="w-8 h-8 rounded-full object-cover border border-gray-200 shadow-sm"
            width={24}
            height={24}
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
