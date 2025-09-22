/**
 *  Button Column Component
 * @format
 */
import PropTypes from "prop-types";
import React from "react";

export default function ButtonColumn({
  buttonName,
  onClick,
  btnClassName = "",
}) {
  return (
    <div className="text-center text-gray-600 text-xs font-bold">
      <button
        className={`bg-gray-600 text-white text-xs font-bold rounded px-3 py-1 mt-2 hover:bg-gray-700 transition ${btnClassName}`}
        onClick={onClick}
      >
        {buttonName}
      </button>
    </div>
  );
}

ButtonColumn.propTypes = {
  buttonName: PropTypes.string,
  onClick: PropTypes.func,
  btnClassName: PropTypes.string,
};
