"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";

import LoadingButton from "@/components/ui/loadingButton";
import { CommonFields, CustomerFields } from "@/constants/fieldsName";
import GenericModal from "@/components/ui/genericModal";
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
import { selectAccessToken } from "@/app/common/selectors";

// Field Configuration Array
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
    type: "select",
    options: [],
    required: true,
    disabled: false,
  },
  {
    name: CustomerFields.CITY,
    label: "City",
    type: "select",
    options: [],
    required: true,
    disabled: false,
  },
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
    required: true,
    disabled: false,
  },
  {
    name: CustomerFields.AADHAR_IMAGE,
    label: "Aadhar Image",
    type: "file",
    required: false,
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
    name: CustomerFields.AGREEMENT_IMAGE,
    label: "Agreement Image",
    type: "file",
    required: false,
    disabled: false,
  },
  {
    name: CustomerFields.PROFILE_IMAGE,
    label: "Profile Image",
    type: "file",
    required: false,
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

const API_KEY = "AIzaSyBkhAI3ZcgXkS33-zUZ5ded-gZtFNQOI_g";
const CLIENT_ID =
  "414759855925-kdkq58dci4aelr0p6aa3s8ilsn8q3c4t.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/drive.file";

// Dynamic gapi load
const loadGapiScript = () => {
  return new Promise((resolve, reject) => {
    if (document.getElementById("gapi")) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.id = "gapi";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("GAPI failed to load"));
    document.body.appendChild(script);
  });
};

const AddEditCustomerComponent = ({ customerId, isEdit }) => {
  const dispatch = useDispatch();
  const navigate = useRouter();
  const initialValues = fields.reduce((acc, f) => {
    if (f.name === CommonFields.IS_ACTIVE) {
      acc[f.name] = true;
    } else {
      acc[f.name] = "";
    }
    return acc;
  }, {});

  const pagination = useSelector(selectCustomerPagination);
  const token = useSelector(selectAccessToken);

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

  // ------------------------ Google Drive Init ------------------------
  useEffect(() => {
    if (typeof window !== "undefined") {
      loadGapiScript()
        .then(() => {
          window.gapi.load("client:auth2", () => {
            window.gapi.client.init({
              apiKey: API_KEY,
              clientId: CLIENT_ID,
              scope: SCOPES,
              discoveryDocs: [
                "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
              ],
            });
          });
        })
        .catch((err) => console.error(err));
    }
  }, []);

  const handleLogin = () => {
    if (window.gapi) {
      window.gapi.auth2
        .getAuthInstance()
        .signIn()
        .then((googleUser) => {
          console.log("User logged in:", googleUser);
        });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first!");
    if (window.gapi) {
      const accessToken = token;
      const metadata = { name: file.name, mimeType: file.type };
      const form = new FormData();
      form.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" })
      );
      form.append("file", file);

      const res = await fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
        {
          method: "POST",
          headers: { Authorization: "Bearer " + accessToken },
          body: form,
        }
      );
      const data = await res.json();
      console.log("File uploaded:", data);
      alert("Uploaded File ID: " + data.id);
    }
  };

  return (
    <div className="flex flex-col gap-6 justify-start w-full mx-auto bg-white rounded-2xl p-6">
      <div className="">
        <TitleAndDescription
          title="Add New Customer"
          description="Manage your Customer"
        />
      </div>
      {/* Formik */}
      <Formik
        initialValues={initialObject}
        // validationSchema={createCustomerSchema}
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
            {/* Google Drive Upload */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleLogin}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Login with Google
              </button>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <button
                onClick={handleUpload}
                disabled={!file}
                className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
              >
                Upload Profile Photo
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <RenderFields
                fields={fields}
                values={values}
                errors={errors}
                touched={touched}
                setFieldValue={setFieldValue}
                handleBlur={handleBlur}
                columns={1}
              />
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

export default AddEditCustomerComponent;
