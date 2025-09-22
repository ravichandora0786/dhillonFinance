"use client";

import React, { useEffect, useState } from "react";
import { Formik, Form, FieldArray, ErrorMessage } from "formik";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import * as Yup from "yup";
import RenderFields from "@/components/ui/renderFields";
import LoadingButton from "@/components/ui/loadingButton";
import { CommonFields, UserFields } from "@/constants/fieldsName";
import TitleAndDescription from "@/components/ui/titleAndDescription";
import { useDispatch, useSelector } from "react-redux";
import {
  selectClassOptions,
  selectSchoolYearOptions,
  selectSectionOptions,
  selectSubjectOptions,
} from "@/app/common/selectors";
import { getAllYearOptions } from "@/app/common/functions";
import { getAllClassOptions, getAllSectionsOptions } from "@/app/common/sagas";
import { createStaff, setStaffPagination, updateStaff } from "../slice";
import { toast } from "react-toastify";
import CustomCheckbox from "@/components/ui/customCheckBox";
import { useRouter } from "next/navigation";

export default function AddEditStaff() {
  const [step, setStep] = useState(1);
  const navigate = useRouter();
  const dispatch = useDispatch();

  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const yearOptions = useSelector(selectSchoolYearOptions);
  const sectionOptions = useSelector(selectSectionOptions);
  const classOption = useSelector(selectClassOptions);
  const subjectOptions = useSelector(selectSubjectOptions);

  const countryOptions = [
    { label: "CA", value: "CA" },
    { label: "CB", value: "CB" },
    { label: "CC", value: "CC" },
  ];
  const stateOptions = [
    { label: "SA", value: "SA" },
    { label: "SB", value: "SB" },
    { label: "SC", value: "SC" },
  ];
  const districtOptions = [
    { label: "DA", value: "DA" },
    { label: "DB", value: "DB" },
    { label: "DC", value: "DC" },
  ];

  // Step Definitions
  const steps = [
    {
      id: 1,
      label: "Personal Information",
      validationSchema: Yup.object({
        fatherName: Yup.string(),
      }),
      fields: [
        {
          name: UserFields.FIRST_NAME,
          label: "First Name",
          type: "text",
          required: true,
        },
        {
          name: UserFields.LAST_NAME,
          label: "Last Name",
          type: "text",
          required: true,
        },
        {
          name: CommonFields.ROLE_ID,
          label: "Role",
          type: "select",
          required: true,
          options: [],
          isMulti: false,
        },
        {
          name: CommonFields.DEPARTMENT_ID,
          label: "Department",
          type: "select",
          required: true,
          options: [],
          isMulti: false,
        },
        {
          name: UserFields.GENDER,
          label: "Gender",
          type: "select",
          options: [
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "other", label: "Other" },
          ],
          required: true,
          isMulti: false,
        },
        {
          name: UserFields.MOBILE_NUMBER,
          label: "Primary Contact Number",
          type: "text",
          required: true,
        },
        {
          name: UserFields.EMAIL,
          label: "Email",
          type: "text",
          required: true,
        },
        {
          name: UserFields.BLOOD_GROUP,
          label: "Blood Group",
          type: "select",
          options: [
            { value: "A+", label: "A+" },
            { value: "A-", label: "A-" },
            { value: "B+", label: "B+" },
            { value: "B-", label: "B-" },
            { value: "AB+", label: "AB+" },
            { value: "AB-", label: "AB-" },
            { value: "O+", label: "O+" },
            { value: "O-", label: "O-" },
          ],
          isMulti: false,
        },
        {
          name: UserFields.MARITAL_STATUS,
          label: "Marital Status",
          type: "select",
          required: true,
          options: [
            { value: "single", label: "Single" },
            { value: "married", label: "Married" },
          ],
          isMulti: false,
        },
        {
          name: UserFields.FATHER_NAME,
          label: "Father Name",
          type: "text",
          required: true,
        },
        {
          name: UserFields.MOTHER_NAME,
          label: "Mother Name",
          type: "text",
          required: true,
        },

        {
          name: UserFields.DATE_OF_BIRTH,
          label: "Date of Birth",
          type: "date",
          required: true,
        },

        {
          name: UserFields.DATE_OF_JOINING,
          label: "Date of Joining",
          type: "date",
          required: true,
        },
        {
          name: UserFields.RELIGION,
          label: "Religin",
          type: "select",
          required: true,
          options: [
            { value: "hindu", label: "Hindu" },
            { value: "sikh", label: "Sikh" },
            { value: "other", label: "Other" },
          ],
        },
        {
          name: UserFields.CATEGORY,
          label: "Category",
          type: "select",
          required: true,
          options: [
            { value: "obc", label: "OBC" },
            { value: "bc", label: "BC" },
            { value: "sc", label: "SC" },
            { value: "gernal", label: "Gernal" },
            { value: "other", label: "Other" },
          ],
        },
        {
          name: UserFields.AADHAR_NUMBER,
          label: "Aadhar Number",
          type: "text",
          required: false,
        },
        {
          name: UserFields.PAN_NUMBER,
          label: "PAN Number",
          type: "text",
          required: false,
        },
        {
          name: UserFields.LANGUAGE_KNOWN,
          label: "Language Known",
          type: "select",
          options: [
            { value: "english", label: "English" },
            { value: "hindi", label: "Hindi" },
            { value: "punjabi", label: "Punjabi" },
          ],
          isMulti: true,
          required: true,
        },
      ],
    },
    {
      id: 2,
      label: "Address Info",
      validationSchema: Yup.object({
        // currentAddress: Yup.object({
        //   addressLine1: Yup.string().required("Address Line 1 is required"),
        //   city: Yup.string().required("City is required"),
        //   district: Yup.string().required("District is required"),
        //   state: Yup.string().required("State is required"),
        //   pinCode: Yup.string().required("Pin Code is required"),
        //   country: Yup.string().required("Country is required"),
        // }),
        // permanentAddress: Yup.object({
        //   addressLine1: Yup.string().required("Address Line 1 is required"),
        //   city: Yup.string().required("City is required"),
        //   district: Yup.string().required("District is required"),
        //   state: Yup.string().required("State is required"),
        //   pinCode: Yup.string().required("Pin Code is required"),
        //   country: Yup.string().required("Country is required"),
        // }),
      }),
      render: ({ values, errors, touched, setFieldValue, handleBlur }) => {
        const addressFields = (prefix) => [
          {
            name: `${prefix}.address`,
            label: "Address",
            type: "text",
            required: true,
          },
          {
            name: `${prefix}.country`,
            label: "Country",
            type: "select",
            options: countryOptions,
            required: true,
            isMulti: false,
          },
          {
            name: `${prefix}.state`,
            label: "State",
            type: "select",
            options: stateOptions,
            required: true,
            isMulti: false,
          },
          {
            name: `${prefix}.district`,
            label: "District",
            type: "select",
            options: districtOptions,
            required: true,
            isMulti: false,
          },
          {
            name: `${prefix}.city`,
            label: "City",
            type: "text",
            required: true,
          },
          {
            name: `${prefix}.pinCode`,
            label: "Pin Code",
            type: "text",
            required: true,
          },
        ];

        return (
          <div className="flex flex-col gap-6 w-full">
            {/* Current Address */}
            <div className="flex-1 p-0 bg-white">
              <label className="text-md font-semibold mb-3">
                Current Address
              </label>
              <RenderFields
                fields={addressFields("currentAddress")}
                values={values}
                errors={errors}
                touched={touched}
                setFieldValue={setFieldValue}
                handleBlur={handleBlur}
                columns={3}
              />
            </div>

            {/* Permanent Address */}
            <div className="flex-1 p-0 bg-white">
              <div className="flex flex-col  justify-between mb-3">
                <label className="text-md font-semibold">
                  Permanent Address
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <CustomCheckbox
                    name={"addressCheckBox"}
                    checked={values.sameAsCurrent || false}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setFieldValue("sameAsCurrent", checked);

                      if (checked) {
                        setFieldValue(
                          "permanentAddress",
                          values.currentAddress
                        );
                      } else {
                        setFieldValue("permanentAddress.address", "");
                        setFieldValue("permanentAddress.country", "");
                        setFieldValue("permanentAddress.state", "");
                        setFieldValue("permanentAddress.district", "");
                        setFieldValue("permanentAddress.city", "");
                        setFieldValue("permanentAddress.pinCode", "");
                        // setFieldValue("permanentAddress", undefined);
                      }
                    }}
                  />
                  Same as Current Address
                </label>
              </div>

              <RenderFields
                fields={addressFields("permanentAddress")}
                values={values}
                errors={errors}
                touched={touched}
                setFieldValue={setFieldValue}
                handleBlur={handleBlur}
                columns={3}
              />
            </div>
          </div>
        );
      },
    },
    {
      id: 3,
      label: "Previous Job Details",
      validationSchema: Yup.object({
        hobbies: Yup.string(),
      }),
      fields: [
        {
          name: UserFields.PRE_JOB_NAME,
          label: "Previous Job Name",
          type: "text",
          required: false,
        },
        {
          name: UserFields.PRE_JOB_ADDRESS,
          label: "Full Address",
          type: "text",
          required: false,
        },
      ],
    },
    {
      id: 4,
      label: "Bank Account Detail",
      validationSchema: Yup.object({}),
      fields: [
        {
          name: UserFields.ACCOUNT_HOLER_NAME,
          label: "Account Holder Name",
          type: "text",
          required: false,
        },
        {
          name: UserFields.BANK_ACCOUNT_NUMBER,
          label: "Account Number",
          type: "text",
          required: false,
        },
        {
          name: UserFields.BANK_NAME,
          label: "Bank Name",
          type: "text",
          required: false,
        },
        {
          name: UserFields.IFSC_CODE,
          label: "IFSC Code",
          type: "text",
          required: false,
        },
        {
          name: UserFields.BRANCH,
          label: "Branch Name",
          type: "text",
          required: false,
        },
      ],
    },
  ];

  const currentStep = steps.find((s) => s.id === step);

  // Initial Values
  const initialValues = steps.reduce((acc, step) => {
    step?.fields?.forEach((f) => {
      acc[f.name] = "";
    });
    return acc;
  }, {});

  // Parents Information ke liye default ek parent row
  initialValues.parents = [
    {
      [UserFields.FULL_NAME]: "",
      [UserFields.EMAIL]: "",
      [UserFields.MOBILE_NUMBER]: "",
      [UserFields.RELATION]: "Father",
      [UserFields.GENDER]: "",
      [UserFields.OCCUPATION]: "",
      [UserFields.AADHAR_NUMBER]: "",
    },
  ];

  const handleNext = async (validateForm, setTouched) => {
    const errors = await validateForm();
    if (Object.keys(errors).length === 0) {
      setStep(step + 1);
    } else {
      setTouched(
        Object.keys(errors).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {})
      );
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleCancel = () => {
    navigate.push("/users/staff");
  };

  useEffect(() => {
    if (dispatch) {
      getAllYearOptions({ dispatch });
      getAllClassOptions({ dispatch });
      getAllSectionsOptions({ dispatch });
    }
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-6 justify-start w-full mx-auto bg-white rounded-2xl p-6 shadow-md">
      <div className="">
        <TitleAndDescription
          title="Add New Staff"
          description="Manage your Staffs"
        />
      </div>

      {/* Stepper Header */}
      <div className="flex justify-between relative">
        {steps.map((s, index) => {
          const isActive = s.id === step;
          const isCompleted = step > s.id;
          return (
            <div key={s.id} className="flex flex-col items-center w-full">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold z-10 ${
                  isActive
                    ? "bg-blue-600"
                    : isCompleted
                    ? "bg-primary"
                    : "bg-gray-300"
                }`}
              >
                {s.id}
              </div>
              <span
                className={`mt-2 text-sm font-medium ${
                  isActive
                    ? "text-blue-600"
                    : isCompleted
                    ? "text-primary"
                    : "text-gray-500"
                }`}
              >
                {s.label}
              </span>
              {index < steps.length - 1 && (
                <div className="absolute top-5 left-0 w-full border-t-2 border-gray-300 z-0"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Formik */}
      <Formik
        initialValues={initialValues}
        validationSchema={currentStep.validationSchema}
        enableReinitialize={true}
        onSubmit={async (values) => {
          try {
            setIsButtonLoading(true);
            const { actionType, sameAsCurrent, ...restValues } = values;
            let filteredValues = JSON.parse(JSON.stringify(restValues));
            if (values?.actionType == "ADD") {
              await new Promise((resolve, reject) => {
                dispatch(
                  createStaff({
                    data: filteredValues,
                    onSuccess: (response) => {
                      toast.success(response?.message);
                      resolve();
                      setIsButtonLoading(false);
                      dispatch(
                        setStaffPagination({ pageIndex: 0, pageSize: 10 })
                      );
                      handleCancel();
                    },
                    onFailure: (error) => {
                      reject(new Error(error));
                      setIsButtonLoading(false);
                    },
                  })
                );
              });
            } else if (values?.actionType == "UPDATE") {
              if (filteredValues) {
                delete filteredValues?.id;
              }
              await new Promise((resolve, reject) => {
                dispatch(
                  updateStaff({
                    id: values.id,
                    data: filteredValues,
                    onSuccess: (response) => {
                      toast.success(response?.message);
                      resolve();
                      setIsButtonLoading(false);
                      dispatch(
                        setStaffPagination({ pageIndex: 0, pageSize: 10 })
                      );
                      handleCancel();
                    },
                    onFailure: (error) => {
                      reject(new Error(error));
                      setIsButtonLoading(false);
                    },
                  })
                );
              });
            }
          } catch (error) {
            console.log(error);
          }
        }}
      >
        {({
          validateForm,
          setTouched,
          values,
          errors,
          touched,
          setFieldValue,
          handleBlur,
        }) => (
          <Form>
            {currentStep.render ? (
              currentStep?.render({
                fields: currentStep.fields,
                values,
                errors,
                touched,
                setFieldValue,
                handleBlur,
              })
            ) : (
              <RenderFields
                fields={currentStep.fields}
                values={values}
                errors={errors}
                touched={touched}
                setFieldValue={setFieldValue}
                handleBlur={handleBlur}
                columns={currentStep.id == 3 ? 2 : currentStep.id == 4 ? 3 : 4}
              />
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <div>
                <LoadingButton
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    handleCancel();
                  }}
                >
                  Cancel
                </LoadingButton>
              </div>
              {step > 1 && (
                <div>
                  <LoadingButton
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      handleBack();
                    }}
                  >
                    Previous
                  </LoadingButton>
                </div>
              )}

              {step < steps.length && (
                <div>
                  <LoadingButton
                    type="button"
                    className="ml-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    variant="custom"
                    onClick={() => handleNext(validateForm, setTouched)}
                  >
                    Next
                  </LoadingButton>
                </div>
              )}

              {step === steps.length && (
                <div>
                  {" "}
                  <LoadingButton
                    type="submit"
                    isLoading={isButtonLoading}
                    disabled={isButtonLoading}
                    onClick={() => {
                      false
                        ? setFieldValue("actionType", "UPDATE")
                        : setFieldValue("actionType", "ADD");
                    }}
                  >
                    {false ? "Update" : "Save & Submit"}
                  </LoadingButton>
                </div>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
