"use client";
/**
 *  SelectDropDown Component
 * @format
 */
import React from "react";
import Select from "react-select";

export default function SelectDropDown({
  name,
  options,
  value,
  error,
  placeholder,
  isSearchable,
  isClearable,
  onChange,
  disabled,
  touched,
  isMulti,
}) {
  const hasError = touched && !!error;
  return (
    <>
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
        isMulti={isMulti}
        menuPlacement="auto"
        className="text-sm h-10"
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          control: (provided, state) => ({
            ...provided,
            border: hasError
              ? "1px solid var(--color-danger)"
              : state.isFocused
              ? "1px solid var(--color-primary)"
              : "1px solid var(--color-gray)",
            borderRadius: "0.4rem",
            boxShadow: state.isFocused
              ? hasError
                ? "0 0 0 2px var(--color-danger)"
                : "0 0 0 2px var(--color-primary)"
              : "none",
            "&:hover": {
              borderColor: hasError
                ? "var(--color-danger)"
                : "var(--color-primary)",
              cursor: "pointer",
            },
            //   height: "max-content",
            //   minHeight: "2.124rem",
            //   maxHeight: "2.124rem",
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
              ? "var(--color-active-bg)"
              : state.isFocused
              ? "var(--color-hover)"
              : "transparent",
            color: state.isSelected
              ? "var(--color-primary)"
              : state.isFocused
              ? "#000"
              : "#000",
            fontSize: "12px",
          }),
          multiValue: (provided) => ({
            ...provided,
            backgroundColor: "var(--color-active-bg)",
            borderRadius: "0.4rem",
          }),
          multiValueLabel: (provided) => ({
            ...provided,
            color: "var(--color-primary)",
            fontSize: "12px",
          }),
          multiValueRemove: (provided, state) => ({
            ...provided,
            // color: "red",
            ":hover": {
              backgroundColor: "rgba(255, 0, 0, 0.1)", // hover par halka red bg
              color: "red",
              cursor: "pointer",
            },
          }),
          placeholder: (provided) => ({
            ...provided,
            //   fontSize: "12px",
            //   color: "#000",
          }),
          singleValue: (provided, state) => ({
            ...provided,
            //   color: "#000",
            //   fontSize: "12px",
          }),
          indicatorContainer: (provided) => ({
            ...provided,
            //   padding: "0px",
          }),
          dropdownIndicator: (provided) => ({
            ...provided,
            padding: "4px",
            color: hasError ? "var(--color-danger)" : "var(--color-primary)",
          }),
        }}
      />
      {touched && error && (
        <div className="mt-1 text-xs text-danger">{error}</div>
      )}
    </>
  );
}
