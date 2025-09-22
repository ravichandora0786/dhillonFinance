/**
 *  Multi Select Component
 * @format
 */
import React from "react";
import Select from "react-select";
import PropTypes from "prop-types";

export default function MultiSelect({
  name,
  options,
  value,
  touched,
  errors,
  placeholder,
  isSearchable,
  isClearable,
  onChange,
  disabled,
}) {
  return (
    <Select
      options={options}
      blurInputOnSelect
      placeholder={placeholder || "Select"}
      isClearable={isClearable}
      isSearchable={isSearchable || false}
      menuPortalTarget={document.body}
      name={name}
      isDisabled={disabled || false}
      value={value}
      controlShouldRenderValue
      hideSelectedOptions={true}
      onChange={onChange}
      menuPlacement="auto"
      className="text-sm"
      isMulti={true}
      styles={{
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        control: (provided, state) => ({
          ...provided,
          border: state.isFocused ? "1px solid #FDE7C4" : "1px solid #D2D6DA",
          borderRadius: "0.5rem",
          boxShadow: state.isFocused ? "0 0 0 2px #FDE7C4" : "none",
          "&:hover": {
            cursor: "pointer",
          },
          height: "max-content",
          minHeight: "2.124rem",
          maxHeight: "2.124rem",
        }),
        option: (provided, state) => {
          const isActive = state.isSelected || state.isFocused;
          const bgColor = isActive ? "#1967D2" : provided.backgroundColor;
          const textColor = isActive ? "#fff" : state.data.color || "#000";

          return {
            ...provided,
            backgroundColor: bgColor,
            color: textColor,
            fontSize: "12px",
          };
        },
        placeholder: (provided, state) => ({
          ...provided,
          fontSize: "12px",
        }),
        singleValue: (provided, state) => ({
          ...provided,
          color: state.data.color || "#000",
          fontSize: "12px",
        }),
        indicatorContainer: (provided, state) => ({
          ...provided,
          padding: "0px",
        }),
        dropdownIndicator: (provided, state) => ({
          ...provided,
          padding: "4px",
        }),
      }}
    />
  );
}

MultiSelect.propTypes = {
  name: PropTypes.string,
  options: PropTypes.array,
  placeholder: PropTypes.string,
  touched: PropTypes.object,
  value: PropTypes.array,
  onChange: PropTypes.func,
  errors: PropTypes.object,
  isClearable: PropTypes.bool,
  isSearchable: PropTypes.bool,
  disabled: PropTypes.bool,
};
