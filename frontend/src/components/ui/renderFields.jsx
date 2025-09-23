import { parseFullDate, todayDate } from "@/Services/utils";
import CustomDatePicker from "./customDatePicker";
import CustomSwitch from "./customSwitch";
import InputBox from "./inputBox";
import SelectDropDown from "./selectDropDown";
import { getIn } from "formik";

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
        }) => {
          const fieldValue = getIn(values, name);
          const fieldError = getIn(errors, name);
          const fieldTouched = getIn(touched, name);
          return (
            <div key={name}>
              {type !== "toggle" && (
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
              ) : [
                  "text",
                  "email",
                  "number",
                  "password",
                  "textarea",
                  "file",
                ].includes(type) ? (
                <InputBox
                  type={type}
                  name={name}
                  value={fieldValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFieldValue(name, value);
                  }}
                  placeholder={`Enter ${label}`}
                  error={fieldError}
                  touched={fieldTouched}
                  disabled={disabled}
                  onBlur={handleBlur}
                />
              ) : (
                <></>
              )}
            </div>
          );
        }
      )}
    </div>
  );
};

export default RenderFields;
