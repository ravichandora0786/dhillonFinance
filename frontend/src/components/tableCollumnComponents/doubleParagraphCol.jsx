/**
 *  Double Paragraph Column Component
 * @format
 */
import PropTypes from "prop-types";
import React from "react";

export default function DoubleParagraphColumn({ value1, value2 }) {
  return (
    <div className="text-center text-gray-600 text-xs ">
      <p className="text-xs mb-0 text-center">{value1 || "-"}</p>
      <p className="text-xs mb-0 text-center">{value2 || "-"}</p>
    </div>
  );
}

DoubleParagraphColumn.propTypes = {
  value1: PropTypes.string,
  value2: PropTypes.string,
};
