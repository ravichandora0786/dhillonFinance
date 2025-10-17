import CustomDatePicker from "./customDatePicker";
import CustomSwitch from "./customSwitch";
import InputBox from "./inputBox";
import SelectDropDown from "./selectDropDown";
import { getIn } from "formik";
import { LoanFields } from "@/constants/fieldsName";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";

const RenderFields = ({
  fields,
  values,
  errors,
  touched,
  setFieldValue,
  handleBlur,
  columns = 4,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const variantClasses = {
    4: "lg:grid-cols-4",
    3: "lg:grid-cols-3",
    2: "lg:grid-cols-2 md:grid-cols-2",
    1: "lg:grid-cols-1 md:grid-cols-1",
  };
  return (
    <div className={`grid grid-cols-1 ${variantClasses[columns]} gap-4`}>
      {fields.map(
        ({
          name,
          label,
          type,
          required,
          options,
          disabled,
          isMulti = false,
          selectOnChange,
          dateMode = "single",
          onChange,
          onKeyDown,
          maxLength,
          minDate,
        }) => {
          const fieldValue = getIn(values, name);
          const fieldError = getIn(errors, name);
          const fieldTouched = getIn(touched, name);
          return (
            <div key={name}>
              {type !== "toggle" && type !== "file" && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {label} {required && <span className="text-danger">*</span>}
                </label>
              )}

              {/* Render Input or Select based on type */}
              {type === "select" ? (
                <SelectDropDown
                  name={name}
                  options={options}
                  value={
                    isMulti
                      ? options?.filter((opt) =>
                          fieldValue?.includes(opt.value)
                        )
                      : options?.find((opt) => opt.value === fieldValue) || null
                  }
                  onChange={
                    selectOnChange
                      ? selectOnChange
                      : (option) => {
                          if (isMulti) {
                            setFieldValue(
                              name,
                              option ? option?.map((opt) => opt.value) : []
                            );
                          } else {
                            setFieldValue(
                              name,
                              option ? option.value : undefined
                            );
                          }
                        }
                  }
                  placeholder={`Select ${label}`}
                  onBlur={handleBlur}
                  isSearchable={true}
                  isClearable={true}
                  touched={fieldTouched}
                  error={fieldError}
                  disabled={disabled}
                  isMulti={isMulti}
                />
              ) : type === "toggle" ? (
                <div className="w-full flex flex-row justify-between">
                  <div className="flex flex-col justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                      {label}{" "}
                      {required && <span className="text-danger">*</span>}
                    </label>
                    <span className="text-gray-500 text-sm">
                      Change the {label} by toggle
                    </span>
                  </div>
                  <div>
                    {" "}
                    <CustomSwitch
                      name={name}
                      disabled={disabled}
                      checked={fieldValue}
                      onChange={(event) => {
                        setFieldValue(name, event.target.checked);
                      }}
                    />
                  </div>
                </div>
              ) : type === "date" ? (
                <CustomDatePicker
                  dateMode={dateMode}
                  name={name}
                  value={fieldValue}
                  onChange={(date) => {
                    if (typeof onChange === "function") {
                      onChange(date, setFieldValue, values);
                      return;
                    } else {
                      setFieldValue(name, date);
                    }
                  }}
                  placeholderText="DD/MM/YYYY"
                  isClearable={true}
                  dateFormat="dd MMM yyyy"
                  minDate={minDate}
                  error={fieldError}
                  touched={fieldTouched}
                  disabled={disabled}
                />
              ) : type === "password" ? (
                <div className="relative">
                  <LockOutlinedIcon className="absolute left-3 top-2 w-5 h-5 text-muted-foreground" />
                  <InputBox
                    id={name}
                    name={name}
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10 w-full"
                    value={fieldValue}
                    onChange={(e) => setFieldValue(name, e.target.value)}
                    placeholder={`Enter ${label}`}
                    error={fieldError}
                    touched={fieldTouched}
                    disabled={disabled}
                    onBlur={handleBlur}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <VisibilityOff className="w-5 h-5 sm:w-6 sm:h-6" />
                    ) : (
                      <Visibility className="w-5 h-5 sm:w-6 sm:h-6" />
                    )}
                  </button>
                </div>
              ) : ["text", "email", "number", "textarea"].includes(type) ? (
                <InputBox
                  type={type}
                  name={name}
                  value={fieldValue}
                  onChange={(e) => {
                    if (typeof onChange === "function") {
                      onChange(e, setFieldValue, values);
                    } else {
                      setFieldValue(name, e.target.value);
                    }
                  }}
                  placeholder={`Enter ${label}`}
                  error={fieldError}
                  touched={fieldTouched}
                  disabled={disabled}
                  onBlur={handleBlur}
                  onKeyDown={onKeyDown}
                  maxLength={maxLength}
                />
              ) : null}
            </div>
          );
        }
      )}
    </div>
  );
};

export default RenderFields;
