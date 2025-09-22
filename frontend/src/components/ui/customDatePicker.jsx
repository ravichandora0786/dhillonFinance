import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CustomDatePicker = (props) => {
  const {
    dateMode = "single",
    name,
    value,
    onChange,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    placeholderText = dateMode === "single"
      ? "Select Date"
      : "Select Date Range",
    isClearable = true,
    dateFormat = "dd-MMM-yyyy",
    className = "",
    minDate,
    disabled,
    touched,
    error,
  } = props;

  const classes = `h-10 w-[100%] rounded-md border text-base bg-white px-3 py-2  file:border-0 file:bg-transparent 
          file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground 
          focus-visible:outline-none focus-visible:ring-2 
          focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${
            touched && error
              ? "border-danger ring-offset-danger hover:border-danger focus-visible:ring-danger"
              : "border-gray ring-offset-primary hover:border-primary focus-visible:ring-primary"
          }    ${className}`;

  const formatDate = (date) => {
    if (!date) return null;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`; // ✅ YYYY-MM-DD
  };

  const parseDate = (dateString) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split("-");
    return new Date(year, month - 1, day);
  };

  // Single Date Handler
  const handleSingleChange = (date) => {
    if (onChange) {
      onChange(formatDate(date));
    }
  };

  // Range Date Handler
  const handleRangeChange = (dates) => {
    const [start, end] = dates;
    if (setStartDate) setStartDate(start ? formatDate(start) : "");
    if (setEndDate) setEndDate(end ? formatDate(end) : "");
  };

  return dateMode === "single" ? (
    <DatePicker
      name={name}
      selected={parseDate(value)}
      onChange={handleSingleChange}
      placeholderText={placeholderText}
      className={classes}
      isClearable={isClearable}
      dateFormat={dateFormat}
      minDate={minDate}
      disabled={disabled || false}
    />
  ) : (
    <DatePicker
      selected={parseDate(startDate)}
      onChange={handleRangeChange}
      startDate={parseDate(startDate)}
      endDate={parseDate(endDate)}
      selectsRange
      placeholderText={placeholderText}
      className={classes}
      isClearable={isClearable}
      dateFormat={dateFormat}
      disabled={disabled || false}
    />
  );
};

export default CustomDatePicker;
