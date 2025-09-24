import { parseFullDate, todayDate } from "@/Services/utils";
import CustomDatePicker from "./customDatePicker";
import CustomSwitch from "./customSwitch";
import InputBox from "./inputBox";
import SelectDropDown from "./selectDropDown";
import { getIn } from "formik";
import LoadingButton from "./loadingButton";
import { LoanFields } from "@/constants/fieldsName";

const RenderFields = ({
  fields,
  values,
  errors,
  touched,
  setFieldValue,
  handleBlur,
  columns = 4,
}) => {
  const today = todayDate();
  const variantClasses = {
    4: "lg:grid-cols-4",
    3: "lg:grid-cols-3",
    2: "lg:grid-cols-2",
    1: "lg:grid-cols-1",
  };
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 ${variantClasses[columns]} gap-4`}
    >
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
          onChange = () => {},
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
                    setFieldValue(name, date);
                  }}
                  placeholderText="DD/MM/YYYY"
                  isClearable={true}
                  dateFormat="dd MMM yyyy"
                  minDate={today}
                />
              ) : ["text", "email", "number", "password", "textarea"].includes(
                  type
                ) ? (
                <InputBox
                  type={type}
                  name={name}
                  value={fieldValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFieldValue(name, value);

                    const principal =
                      name === LoanFields.PRINCIPAL_AMOUNT
                        ? parseFloat(value)
                        : parseFloat(values[LoanFields.PRINCIPAL_AMOUNT] || 0);

                    const totalPay =
                      name === LoanFields.TOTAL_PAY_AMOUNT
                        ? parseFloat(value)
                        : parseFloat(values[LoanFields.TOTAL_PAY_AMOUNT] || 0);

                    const months =
                      name === LoanFields.MONTHS
                        ? parseInt(value)
                        : parseInt(values[LoanFields.MONTHS] || 0);

                    if (principal > 0 && totalPay > 0 && months > 0) {
                      // EMI calculation with interest
                      const emi = totalPay / months;

                      // Interest rate calculation
                      const interestAmount = totalPay - principal;
                      const interestRate = (interestAmount / principal) * 100;

                      setFieldValue(LoanFields.EMI_AMOUNT, emi.toFixed(2));
                      setFieldValue(
                        LoanFields.INTREST_RATE,
                        interestRate.toFixed(2)
                      );
                    } else {
                      setFieldValue(LoanFields.EMI_AMOUNT, "");
                      setFieldValue(LoanFields.INTREST_RATE, "");
                    }
                  }}
                  placeholder={`Enter ${label}`}
                  error={fieldError}
                  touched={fieldTouched}
                  disabled={disabled}
                  onBlur={handleBlur}
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
