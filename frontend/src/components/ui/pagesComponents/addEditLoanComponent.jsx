"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";

import LoadingButton from "@/components/ui/loadingButton";
import { CommonFields, CustomerLoanFields } from "@/constants/fieldsName";
import GenericModal from "@/components/ui/genericModal";
import RenderFields from "@/components/ui/renderFields";
import {
  selectCustomerLoanData,
  selectCustomerLoanPagination,
} from "@/app/loan/selector";
import {
  createCustomerLoan,
  getCustomerLoanDetailById,
  setCustomerLoanPagination,
  updateCustomerLoan,
} from "@/app/loan/slice";
import TitleAndDescription from "../titleAndDescription";

// Field Configuration Array
const fields = [
  {
    name: CustomerLoanFields.NAME,
    label: "Year Name",
    type: "text",
    required: true,
    disabled: false,
  },
  {
    name: CustomerLoanFields.START_DATE,
    label: "Start Date",
    type: "date",
    required: true,
    disabled: false,
    dateMode: "single",
  },
  {
    name: CustomerLoanFields.END_DATE,
    label: "End Date",
    type: "date",
    required: true,
    disabled: false,
    dateMode: "single",
  },
  {
    name: CommonFields.DESCRIPTION,
    label: "Description",
    type: "textarea",
    required: false,
    disabled: false,
  },
  {
    name: CommonFields.IS_ACTIVE,
    label: "Active",
    type: "toogle",
    required: true,
    disabled: false,
  },
];

const AddEditCustomerLoanComponent = ({ customerLoanId, isEdit }) => {
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

  const pagination = useSelector(selectCustomerLoanPagination);

  // Initial form state from field array
  const [buttonLoading, setButtonLoading] = useState(false);
  const [initialObject, setInitialObject] = useState(initialValues);

  const goBack = () => {
    navigate.push("/loan");
  };

  const handleSubmitData = async (values) => {
    setButtonLoading(true);
    const { actionType, ...restValues } = values;
    let filteredValues = structuredClone(restValues);
    if (values?.actionType == "ADD") {
      await new Promise((resolve, reject) => {
        dispatch(
          createCustomerLoan({
            data: filteredValues,
            onSuccess: (response) => {
              toast.success(response?.message);
              resolve();
              dispatch(
                setCustomerLoanPagination({ pageIndex: 0, pageSize: 10 })
              );
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
          updateCustomerLoan({
            id: values.id,
            data: filteredValues,
            onSuccess: (response) => {
              toast.success(response?.message);
              dispatch(setCustomerLoanPagination({ ...pagination }));
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
    if (customerLoanId) {
      dispatch(
        getCustomerLoanDetailById({
          id: customerLoanId,
          onSuccess: ({ message, data }) => {
            if (data) {
              const obj = {
                [CommonFields.ID]: data[CommonFields.ID],
                [CustomerLoanFields.NAME]: data[CustomerLoanFields.NAME],
                [CustomerLoanFields.START_DATE]:
                  data[CustomerLoanFields.START_DATE],
                [CustomerLoanFields.END_DATE]:
                  data[CustomerLoanFields.END_DATE],
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
  }, [customerLoanId, dispatch]);

  return (
    <div className="flex flex-col gap-6 justify-start w-full mx-auto bg-white rounded-2xl p-6 border">
      <div className="">
        <TitleAndDescription
          title="Add New CustomerLoan"
          description="Manage your CustomerLoan"
        />
      </div>
      {/* Formik */}
      <Formik
        initialValues={initialObject}
        // validationSchema={createCustomerLoanSchema}
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

export default AddEditCustomerLoanComponent;
