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
                      onChange(date, setFieldValue);
                      return;
                    } else {
                      setFieldValue(name, date);
                      // calculate end date if start date and months available
                      const startDate =
                        name === LoanFields.START_DATE
                          ? new Date(date)
                          : new Date(values[LoanFields.START_DATE]);

                      const months = parseInt(values[LoanFields.MONTHS] || 0);

                      if (
                        startDate &&
                        months > 0 &&
                        !isNaN(startDate.getTime())
                      ) {
                        const endDate = new Date(startDate);
                        endDate.setMonth(endDate.getMonth() + months);

                        const formattedEndDate = endDate
                          .toISOString()
                          .split("T")[0];

                        setFieldValue(LoanFields.END_DATE, formattedEndDate);
                      }
                    }
                  }}
                  placeholderText="DD/MM/YYYY"
                  isClearable={true}
                  dateFormat="dd MMM yyyy"
                  minDate={minDate}
                  error={fieldError}
                  touched={fieldTouched}
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
                    const value = e.target.value;
                    // agar field ke config me custom onChange diya gaya hai
                    if (typeof onChange === "function") {
                      onChange(e, setFieldValue);
                      return;
                    } else {
                      setFieldValue(name, value);

                      const principal =
                        name === LoanFields.PRINCIPAL_AMOUNT
                          ? parseFloat(value)
                          : parseFloat(
                              values[LoanFields.PRINCIPAL_AMOUNT] || 0
                            );

                      const totalPay =
                        name === LoanFields.TOTAL_PAY_AMOUNT
                          ? parseFloat(value)
                          : parseFloat(
                              values[LoanFields.TOTAL_PAY_AMOUNT] || 0
                            );

                      const months =
                        name === LoanFields.MONTHS
                          ? parseInt(value)
                          : parseInt(values[LoanFields.MONTHS] || 0);

                      const interestRate =
                        name === LoanFields.INTREST_RATE
                          ? parseFloat(value)
                          : parseFloat(values[LoanFields.INTREST_RATE] || 0);

                      // Case 1: Interest rate changed → calculate totalPayAmount + EMI
                      if (
                        name === LoanFields.INTREST_RATE &&
                        principal > 0 &&
                        interestRate >= 0 &&
                        months > 0
                      ) {
                        // Monthly Interest Calculation
                        const interestAmountPerMonth =
                          (principal * interestRate) / 100;
                        const totalInterest = interestAmountPerMonth * months;
                        const totalPayAmount = principal + totalInterest;
                        const emi = totalPayAmount / months;

                        setFieldValue(
                          LoanFields.TOTAL_PAY_AMOUNT,
                          totalPayAmount.toFixed(2)
                        );
                        setFieldValue(LoanFields.EMI_AMOUNT, emi.toFixed(2));
                      }

                      // Case 2: Total pay or principal changed → calculate EMI and interest rate
                      else if (
                        (name === LoanFields.PRINCIPAL_AMOUNT ||
                          name === LoanFields.TOTAL_PAY_AMOUNT) &&
                        principal > 0 &&
                        totalPay > 0 &&
                        months > 0
                      ) {
                        const emi = totalPay / months;
                        const totalInterest = totalPay - principal;
                        const monthlyInterestRate =
                          (totalInterest / principal / months) * 100;

                        setFieldValue(LoanFields.EMI_AMOUNT, emi.toFixed(2));
                        setFieldValue(
                          LoanFields.INTREST_RATE,
                          monthlyInterestRate.toFixed(2)
                        );
                      }

                      // Case 3: Months changed → recalculate EMI and total with monthly rate
                      else if (name === LoanFields.MONTHS && months > 0) {
                        const currentPrincipal = parseFloat(
                          values[LoanFields.PRINCIPAL_AMOUNT] || 0
                        );
                        const currentRate = parseFloat(
                          values[LoanFields.INTREST_RATE] || 0
                        );

                        if (currentPrincipal > 0 && currentRate >= 0) {
                          const interestAmountPerMonth =
                            (currentPrincipal * currentRate) / 100;
                          const totalInterest = interestAmountPerMonth * months;
                          const totalPayAmount =
                            currentPrincipal + totalInterest;
                          const emi = totalPayAmount / months;

                          setFieldValue(
                            LoanFields.TOTAL_PAY_AMOUNT,
                            totalPayAmount.toFixed(2)
                          );
                          setFieldValue(LoanFields.EMI_AMOUNT, emi.toFixed(2));
                        }
                      }
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
