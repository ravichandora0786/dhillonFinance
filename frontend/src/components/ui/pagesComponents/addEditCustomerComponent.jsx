"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Formik, useFormikContext } from "formik";

import LoadingButton from "@/components/ui/loadingButton";
import { CommonFields, CustomerFields } from "@/constants/fieldsName";
import RenderFields from "@/components/ui/renderFields";
import {
  selectCustomerData,
  selectCustomerPagination,
} from "@/app/customer/selector";
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
    },
    {
      name: CustomerFields.LAST_NAME,
      label: "Last Name",
      type: "text",
      required: false,
      disabled: false,
    },
    {
      name: CustomerFields.MOBILE_NUMBER,
      label: "Mobile Number",
      type: "text",
      required: true,
      disabled: false,
    },
    {
      name: CustomerFields.ADDRESS,
      label: "Address",
      type: "textarea",
      required: true,
      disabled: false,
    },
    {
      name: CustomerFields.STATE,
      label: "State",
      type: "text",
      required: true,
      disabled: false,
    },
    {
      name: CustomerFields.CITY,
      label: "City",
      type: "text",
      required: true,
      disabled: false,
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
    },
    {
      name: CustomerFields.AADHAR_NUMBER,
      label: "Aadhar Number",
      type: "text",
      required: true,
      disabled: false,
    },
    {
      name: CustomerFields.PAN_CARD_NUMBER,
      label: "PAN Card Number",
      type: "text",
      required: false,
      disabled: false,
    },
    {
      name: CustomerFields.VEHICLE_NUMBER,
      label: "Vehicle Number",
      type: "text",
      required: true,
      disabled: false,
    },

    {
      name: CommonFields.IS_ACTIVE,
      label: "Active",
      type: "toggle",
      required: true,
      disabled: false,
    },
  ];
  let initialValues = fields.reduce((acc, f) => {
    if (f.name === CommonFields.IS_ACTIVE) {
      acc[f.name] = true;
    } else {
      acc[f.name] = "";
    }
    return acc;
  }, {});

  const defaultImage = {
    [CustomerFields.AADHAR_IMAGE]: "",
    [CustomerFields.ANY_PRUF_IMAGE]: "",
    [CustomerFields.AGREEMENT_IMAGE]: "",
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
                [CustomerFields.START_DATE]: data[CustomerFields.START_DATE],
                [CustomerFields.END_DATE]: data[CustomerFields.END_DATE],
                [CommonFields.DESCRIPTION]: data[CommonFields.DESCRIPTION],
                [CommonFields.IS_ACTIVE]: data[CommonFields.IS_ACTIVE],
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
                    onChange: (e) => {
                      setSelectedImage(e.target.files[0]);
                    },
                  },

                  {
                    name: CustomerFields.AGREEMENT_IMAGE,
                    label: "Agreement Image",
                    type: "file",
                    required: true,
                    disabled: false,
                  },
                  {
                    name: CustomerFields.ANY_PRUF_IMAGE,
                    label: "Pruf",
                    type: "file",
                    required: true,
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
  );
};

const UploadImage = ({ fieldName, error, touched }) => {
  const { setFieldValue, values } = useFormikContext();
  const dispatch = useDispatch();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploaded, setIsUploaded] = useState(true);
  // Function to fetch and update file fields
  const updateFileField = async (fieldKey, fileId) => {
    if (!fileId) return;

    dispatch(
      getUploadedFile({
        id: fileId,
        onSuccess: ({ data }) => {
          console.log(data?.url, "response");
          if (data?.url) {
            setUploadedImage(data?.url);
          }
        },
        onFailure: () => {
          console.error(`Failed to fetch file for ${fieldKey}`);
        },
      })
    );
  };

  useEffect(() => {
    if (
      values[fieldName] &&
      typeof values[fieldName] === "string" &&
      isUploaded
    ) {
      console.log(values[fieldName], isUploaded, 11111111111111);
      updateFileField(fieldName, values[fieldName]);
      setIsUploaded(false);
    }
  }, [values[fieldName], isUploaded]);
  return uploadedImage && values[fieldName] ? (
    <div className="relative w-32 p-2 rounded border">
      <img
        src={uploadedImage}
        className="w-full h-20 object-cover rounded"
        alt="Preview"
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
            isLoading={false}
            disabled={!selectedImage}
            onClick={() => {
              if (selectedImage) {
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
                        }
                        toast.success(message);
                      },
                      onFailure: () => {},
                    })
                  );
                } catch (error) {
                  console.error(error);
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
  );
};

export default AddEditCustomerComponent;
