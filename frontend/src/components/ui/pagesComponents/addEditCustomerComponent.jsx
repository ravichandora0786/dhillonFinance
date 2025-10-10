"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Formik, useFormikContext } from "formik";

import LoadingButton from "@/components/ui/loadingButton";
import { CommonFields, CustomerFields } from "@/constants/fieldsName";
import RenderFields from "@/components/ui/renderFields";
import { selectCustomerPagination } from "@/app/customer/selector";
import {
  createCustomer,
  getCustomerDetailById,
  setCustomerPagination,
  updateCustomer,
} from "@/app/customer/slice";
import TitleAndDescription from "../titleAndDescription";
import { getUploadedFile, imageUpload } from "@/app/common/slice";
import InputBox from "../inputBox";
import BackButton from "../backButton";
import { createCustomerSchema } from "@/validationSchema/customerSchema";
import FullScreenLoader from "@/components/ui/fullScreenLoader";
import { customerStatusOptions } from "@/constants/dropdown";
import CustomImageComponent from "@/components/ui/customImageComponent";

// Field Configuration Array

const AddEditCustomerComponent = ({ customerId, isEdit }) => {
  const dispatch = useDispatch();
  const navigate = useRouter();

  const fields = [
    {
      name: CustomerFields.FIRST_NAME,
      label: "First Name",
      type: "text",
      required: true,
      disabled: false,
      maxLength: 30,
    },
    {
      name: CustomerFields.LAST_NAME,
      label: "Last Name",
      type: "text",
      required: false,
      disabled: false,
      maxLength: 30,
    },
    {
      name: CustomerFields.MOBILE_NUMBER,
      label: "Mobile Number",
      type: "text",
      required: true,
      disabled: false,
      maxLength: 10,
      onKeyDown: (e) => {
        const value = e.target.value;
        if (
          [
            "Backspace",
            "Delete",
            "Tab",
            "Escape",
            "Enter",
            "ArrowLeft",
            "ArrowRight",
          ].includes(e.key)
        ) {
          return;
        }
        // Sirf digits allow
        if (!/^[0-9]$/.test(e.key)) {
          e.preventDefault();
          return;
        }

        // Max length = 12
        if (value.length >= 10) {
          e.preventDefault();
          return;
        }
      },
    },
    {
      name: CustomerFields.ADDRESS,
      label: "Address",
      type: "textarea",
      required: true,
      disabled: false,
      maxLength: 100,
    },
    {
      name: CustomerFields.STATE,
      label: "State",
      type: "text",
      required: true,
      disabled: false,
      maxLength: 30,
    },
    {
      name: CustomerFields.CITY,
      label: "City",
      type: "text",
      required: true,
      disabled: false,
      maxLength: 50,
    },
    // {
    //   name: CustomerFields.DISTRICT,
    //   label: "District",
    //   type: "select",
    //   options: districtOptions,
    //   required: true,
    //   disabled: false,
    // },
    {
      name: CustomerFields.PIN_CODE,
      label: "Pin Code",
      type: "text",
      required: true,
      disabled: false,
      maxLength: 6,
    },
    {
      name: CustomerFields.AADHAR_NUMBER,
      label: "Aadhar Number",
      type: "text",
      required: true,
      disabled: false,
      maxLength: 14,
      onKeyDown: (e) => {
        const value = e.target.value;

        // Allow: Backspace, Delete, Tab, Escape, Enter, Arrow keys
        if (
          [
            "Backspace",
            "Delete",
            "Tab",
            "Escape",
            "Enter",
            "ArrowLeft",
            "ArrowRight",
          ].includes(e.key)
        ) {
          return;
        }

        // Sirf digits allow
        if (!/^[0-9]$/.test(e.key)) {
          e.preventDefault();
          return;
        }

        // Max length = 12
        if (value.length >= 14) {
          e.preventDefault();
          return;
        }
      },
      onChange: (e, setFieldValue) => {
        let value = e.target.value.replace(/\D/g, "");

        // format: xxxx-xxxx-xxxx
        if (value.length > 4 && value.length <= 8) {
          value = `${value.slice(0, 4)}-${value.slice(4)}`;
        } else if (value.length > 8) {
          value = `${value.slice(0, 4)}-${value.slice(4, 8)}-${value.slice(
            8,
            12
          )}`;
        }

        setFieldValue(CustomerFields.AADHAR_NUMBER, value);
      },
    },
    {
      name: CustomerFields.PAN_CARD_NUMBER,
      label: "PAN Card Number",
      type: "text",
      required: false,
      disabled: false,
      maxLength: 10,
      onKeyDown: (e) => {
        const value = e.target.value;

        // Allow: Backspace, Delete, Tab, Escape, Enter, Arrow keys
        if (
          [
            "Backspace",
            "Delete",
            "Tab",
            "Escape",
            "Enter",
            "ArrowLeft",
            "ArrowRight",
          ].includes(e.key)
        ) {
          return;
        }

        // Allow only A-Z or a-z or 0-9
        if (!/^[a-zA-Z0-9]$/.test(e.key)) {
          e.preventDefault();
          return;
        }

        // Max length = 10
        if (value.length >= 10) {
          e.preventDefault();
          return;
        }
      },
    },
    {
      name: CustomerFields.VEHICLE_NUMBER,
      label: "Vehicle Number",
      type: "text",
      required: true,
      disabled: false,
      maxLength: 20,
      onKeyDown: (e) => {
        const value = e.target.value;
        if (
          [
            "Backspace",
            "Delete",
            "Tab",
            "Escape",
            "Enter",
            "ArrowLeft",
            "ArrowRight",
          ].includes(e.key)
        ) {
          return;
        }
        if (!/^[a-zA-Z0-9 ]$/.test(e.key)) {
          e.preventDefault();
          return;
        }
      },
    },

    {
      name: CommonFields.STATUS,
      label: "Status",
      type: "select",
      options: customerStatusOptions,
      required: true,
      disabled: false,
    },
  ];
  let initialValues = fields.reduce((acc, f) => {
    if (f.name === CommonFields.STATUS) {
      acc[f.name] = "Active";
    } else {
      acc[f.name] = "";
    }
    return acc;
  }, {});

  const defaultImage = {
    [CustomerFields.AADHAR_IMAGE]: "",
    [CustomerFields.ANY_PRUF_IMAGE]: "",
    // [CustomerFields.AGREEMENT_IMAGE]: undefined,
    // [CustomerFields.PAN_CARD_IMAGE]: undefined,
    [CustomerFields.PROFILE_IMAGE]: "",
  };

  initialValues = { ...initialValues, ...defaultImage };

  const pagination = useSelector(selectCustomerPagination);

  // Initial form state from field array
  const [buttonLoading, setButtonLoading] = useState(false);
  const [initialObject, setInitialObject] = useState(initialValues);
  const [file, setFile] = useState(null);

  const goBack = () => {
    navigate.push("/customer");
  };

  const handleSubmitData = async (values) => {
    setButtonLoading(true);
    const { actionType, ...restValues } = values;
    let filteredValues = structuredClone(restValues);
    if (values?.actionType == "ADD") {
      await new Promise((resolve, reject) => {
        dispatch(
          createCustomer({
            data: filteredValues,
            onSuccess: (response) => {
              toast.success(response?.message);
              resolve();
              dispatch(setCustomerPagination({ pageIndex: 0, pageSize: 10 }));
              goBack();
              setButtonLoading(false);
            },
            onFailure: (error) => {
              reject(new Error(error));
              setButtonLoading(false);
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
          updateCustomer({
            id: values.id,
            data: filteredValues,
            onSuccess: (response) => {
              toast.success(response?.message);
              dispatch(setCustomerPagination({ ...pagination }));
              resolve();
              goBack();
              setButtonLoading(false);
            },
            onFailure: (error) => {
              reject(new Error(error));
              setButtonLoading(false);
            },
          })
        );
      });
    }
  };

  useEffect(() => {
    if (customerId) {
      dispatch(
        getCustomerDetailById({
          id: customerId,
          onSuccess: ({ message, data }) => {
            console.log(message);
            if (data) {
              const obj = {
                [CommonFields.ID]: data[CommonFields.ID],
                [CustomerFields.FIRST_NAME]: data[CustomerFields.FIRST_NAME],
                [CustomerFields.LAST_NAME]: data[CustomerFields.LAST_NAME],
                [CustomerFields.MOBILE_NUMBER]:
                  data[CustomerFields.MOBILE_NUMBER],
                [CustomerFields.PIN_CODE]: data[CustomerFields.PIN_CODE],
                [CustomerFields.ADDRESS]: data[CustomerFields.ADDRESS],
                [CustomerFields.CITY]: data[CustomerFields.CITY],
                [CustomerFields.STATE]: data[CustomerFields.STATE],
                [CustomerFields.AADHAR_NUMBER]:
                  data[CustomerFields.AADHAR_NUMBER],
                [CustomerFields.PAN_CARD_NUMBER]:
                  data[CustomerFields.PAN_CARD_NUMBER],
                [CustomerFields.AADHAR_IMAGE]:
                  data[CustomerFields.AADHAR_IMAGE],
                [CustomerFields.PAN_CARD_IMAGE]:
                  data[CustomerFields.PAN_CARD_IMAGE],
                [CustomerFields.AGREEMENT_IMAGE]:
                  data[CustomerFields.AGREEMENT_IMAGE],
                [CustomerFields.PROFILE_IMAGE]:
                  data[CustomerFields.PROFILE_IMAGE],
                [CustomerFields.ANY_PRUF_IMAGE]:
                  data[CustomerFields.ANY_PRUF_IMAGE],
                [CustomerFields.PAN_CARD_IMAGE]:
                  data[CustomerFields.PAN_CARD_IMAGE],
                [CustomerFields.START_DATE]: data[CustomerFields.START_DATE],
                [CustomerFields.END_DATE]: data[CustomerFields.END_DATE],
                [CommonFields.DESCRIPTION]: data[CommonFields.DESCRIPTION],
                [CommonFields.STATUS]: data[CommonFields.STATUS],
                [CustomerFields.VEHICLE_NUMBER]:
                  data[CustomerFields.VEHICLE_NUMBER],
              };

              setInitialObject(obj);
            }
          },
          onFailure: () => {},
        })
      );
    }
  }, [customerId, dispatch]);

  useEffect(() => {}, []);

  return (
    <>
      <div className="flex flex-col gap-6 justify-start w-full mx-auto bg-white rounded-2xl p-6">
        <div className="">
          <BackButton />
        </div>
        <div className="">
          <TitleAndDescription
            title={isEdit ? "Edit Customer" : "Add New Customer"}
            description=""
          />
        </div>
        {/* Formik */}
        <Formik
          initialValues={initialObject}
          validationSchema={createCustomerSchema}
          enableReinitialize={true}
          onSubmit={handleSubmitData}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleSubmit,
            setFieldValue,
            resetForm,
          }) => (
            <>
              <form onSubmit={handleSubmit} className="">
                <RenderFields
                  fields={fields}
                  values={values}
                  errors={errors}
                  touched={touched}
                  setFieldValue={setFieldValue}
                  handleBlur={handleBlur}
                  columns={2}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 py-4">
                  {[
                    {
                      name: CustomerFields.PROFILE_IMAGE,
                      label: "Profile Image",
                      type: "file",
                      required: true,
                      disabled: false,
                    },
                    {
                      name: CustomerFields.AADHAR_IMAGE,
                      label: "Aadhar Image",
                      type: "file",
                      required: true,
                      disabled: false,
                    },
                    {
                      name: CustomerFields.PAN_CARD_IMAGE,
                      label: "PAN Card Image",
                      type: "file",
                      required: false,
                      disabled: false,
                    },
                    {
                      name: CustomerFields.ANY_PRUF_IMAGE,
                      label: "Other Pruf/Vehicle Number",
                      type: "file",
                      required: true,
                      disabled: false,
                    },
                    {
                      name: CustomerFields.AGREEMENT_IMAGE,
                      label: "Agreement Image",
                      type: "file",
                      required: false,
                      disabled: false,
                    },
                  ]?.map((field) => {
                    return (
                      <div key={field.name} className="">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.label}{" "}
                          {field.required && (
                            <span className="text-danger">*</span>
                          )}
                        </label>
                        <UploadImage
                          fieldName={field?.name}
                          error={errors[field?.name]}
                          touched={touched[field?.name]}
                        />
                      </div>
                    );
                  })}
                </div>
                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-6">
                  <div>
                    <LoadingButton
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        resetForm();
                        goBack();
                      }}
                    >
                      Cancel
                    </LoadingButton>
                  </div>
                  <div>
                    <LoadingButton
                      type="submit"
                      isLoading={buttonLoading}
                      disabled={buttonLoading}
                      onClick={() => {
                        isEdit
                          ? setFieldValue("actionType", "UPDATE")
                          : setFieldValue("actionType", "ADD");
                      }}
                    >
                      {isEdit ? "Update" : "Save & Submit"}
                    </LoadingButton>
                  </div>
                </div>
              </form>
            </>
          )}
        </Formik>
      </div>
      <FullScreenLoader showLoader={buttonLoading} message="Please Wait..." />
    </>
  );
};

const UploadImage = ({ fieldName, error, touched }) => {
  const { setFieldValue, values } = useFormikContext();
  const dispatch = useDispatch();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploaded, setIsUploaded] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  // Function to fetch and update file fields
  const updateFileField = async (fieldKey, fileId) => {
    if (!fileId) return;

    dispatch(
      getUploadedFile({
        id: fileId,
        onSuccess: ({ data }) => {
          if (data?.url) {
            setUploadedImage(data?.url);
          }
        },
        onFailure: () => {},
      })
    );
  };

  useEffect(() => {
    if (
      values[fieldName] &&
      typeof values[fieldName] === "string" &&
      isUploaded
    ) {
      updateFileField(fieldName, values[fieldName]);
      // setIsUploaded(false);
    }
  }, [values[fieldName], isUploaded]);
  return (
    <>
      <FullScreenLoader showLoader={isUploading} message="Uploading image..." />
      {uploadedImage && values[fieldName] ? (
        <div className="relative w-32 p-2 rounded border">
          <CustomImageComponent
            alt={"customerImage"}
            imageUrl={uploadedImage}
            className="w-full h-20 object-cover rounded"
            width={200}
            height={200}
          />
          <button
            type="button"
            className="absolute top-1 right-1 bg-white text-red-500 font-bold rounded-full w-6 h-6 flex items-center justify-center shadow"
            onClick={() => {
              setIsUploaded(false);
              setUploadedImage(null);
              setSelectedImage(null);
            }}
          >
            ×
          </button>
        </div>
      ) : (
        <div className="">
          <div className="flex items-center justify-between rounded-md w-full gap-3">
            <InputBox
              accept="image/jpeg,image/png"
              name={fieldName}
              type="file"
              id={fieldName}
              onChange={(e) => {
                const file = e.target.files[0];
                setSelectedImage(file);
                setFieldValue(fieldName, file);
              }}
              // error={error}
              // touched={touched}
              // disabled={disabled}
              // onBlur={handleBlur}
            />
            <div>
              <LoadingButton
                type="button"
                isLoading={isUploading}
                disabled={!selectedImage || isUploading}
                onClick={() => {
                  if (selectedImage) {
                    setIsUploading(true);
                    setIsUploaded(true);
                    try {
                      dispatch(
                        imageUpload({
                          file: selectedImage,
                          // type: fieldName,
                          onSuccess: (response) => {
                            const { message, data } = response;
                            if (data) {
                              setFieldValue(fieldName, data?.id);
                              setSelectedImage(null);
                              setIsUploading(false);
                            }
                            toast.success(message);
                          },
                          onFailure: () => {
                            setIsUploading(false);
                          },
                        })
                      );
                    } catch (error) {
                      console.error(error);
                      setIsUploading(false);
                    }
                  }
                }}
              >
                Upload
              </LoadingButton>
            </div>
          </div>
          {touched && error && (
            <div className="mt-1 text-xs text-danger">{error}</div>
          )}
        </div>
      )}
    </>
  );
};

export default AddEditCustomerComponent;
