/**
 *  Single Paragraph Column Component
 * @format
 */
import PropTypes from "prop-types";
import React from "react";

export default function SingleParagraphColumn({ value, className }) {
  return (
    <div className={`text-center text-gray-600 text-xs ${className}`}>
      {value?.toString() || "-"}
    </div>
  );
}

SingleParagraphColumn.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
};
