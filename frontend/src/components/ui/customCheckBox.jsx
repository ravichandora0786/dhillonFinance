"useClient";
import React from "react";

const CustomCheckbox = ({ checked, onChange, name }) => {
  return (
    <label className="custom-checkbox-label">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
      />
      <span className="checkmark"></span>
    </label>
  );
};

export default CustomCheckbox;
