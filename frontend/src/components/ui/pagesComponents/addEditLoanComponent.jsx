"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";

import LoadingButton from "@/components/ui/loadingButton";
import { CommonFields, LoanFields } from "@/constants/fieldsName";
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
import { getCustomerListForOptions } from "@/app/customer/slice";
import BackButton from "../backButton";
import { createCustomerLoanSchema } from "@/validationSchema/loanSchema";

const AddEditCustomerLoanComponent = ({ customerLoanId, isEdit }) => {
  const dispatch = useDispatch();
  const navigate = useRouter();
  const [customerOptions, setCustomerOptions] = useState([]);

  // Field Configuration Array
  const fields = [
    {
      name: CommonFields.CUSTOMER_ID,
      label: "Customer Name",
      type: "select",
      options: customerOptions,
      required: true,
      disabled: false,
    },

    {
      name: LoanFields.PRINCIPAL_AMOUNT,
      label: "Pay Amount",
      type: "text",
      required: true,
      disabled: false,
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
      },
    },
    {
      name: LoanFields.TOTAL_PAY_AMOUNT,
      label: "Loan Amount",
      type: "text",
      required: true,
      disabled: false,
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
      },
    },
    {
      name: LoanFields.MONTHS,
      label: "No. of Installments",
      type: "text",
      required: true,
      disabled: false,
      maxLength: 3,
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
      },
    },
    {
      name: LoanFields.EMI_AMOUNT,
      label: "EMI",
      type: "text",
      required: true,
      disabled: true,
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
      },
    },
    {
      name: LoanFields.INTREST_RATE,
      label: "Intrest Rate",
      type: "text",
      required: true,
      disabled: false,
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
      },
    },
    {
      name: LoanFields.PAY_INSTALLMENT_DATE,
      label: "Pay Installment Date",
      type: "date",
      required: true,
      disabled: false,
      dateMode: "single",
    },
    {
      name: LoanFields.START_DATE,
      label: "Start Date",
      type: "date",
      required: true,
      disabled: false,
      dateMode: "single",
    },
    {
      name: LoanFields.END_DATE,
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
      maxLength: 300,
    },
    {
      name: CommonFields.STATUS,
      label: "Status",
      type: "text",
      required: true,
      disabled: false,
    },
  ];

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
            console.log(message);
            if (data) {
              const obj = {
                [CommonFields.ID]: data[CommonFields.ID],
                [CommonFields.CUSTOMER_ID]: data[CommonFields.CUSTOMER_ID],

                [LoanFields.PRINCIPAL_AMOUNT]:
                  data[LoanFields.PRINCIPAL_AMOUNT],
                [LoanFields.TOTAL_PAY_AMOUNT]:
                  data[LoanFields.TOTAL_PAY_AMOUNT],
                [LoanFields.MONTHS]: data[LoanFields.MONTHS],
                [LoanFields.EMI_AMOUNT]: data[LoanFields.EMI_AMOUNT],
                [LoanFields.INTREST_RATE]: data[LoanFields.INTREST_RATE],
                [LoanFields.PAY_INSTALLMENT_DATE]:
                  data[LoanFields.PAY_INSTALLMENT_DATE],
                [LoanFields.START_DATE]: data[LoanFields.START_DATE],
                [LoanFields.END_DATE]: data[LoanFields.END_DATE],
                [CommonFields.DESCRIPTION]: data[CommonFields.DESCRIPTION],
                [CommonFields.STATUS]: data[CommonFields.STATUS],
              };

              setInitialObject(obj);
            }
          },
          onFailure: () => {},
        })
      );
    }
  }, [customerLoanId, dispatch]);

  useEffect(() => {
    dispatch(
      getCustomerListForOptions({
        data: { search: "" },
        onSuccess: ({ data }) => {
          const options = data?.customers?.map((item) => {
            return { label: item.name, value: item.id };
          });
          setCustomerOptions(options || []);
        },
        onFailure: () => {},
      })
    );
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-6 justify-start w-full mx-auto bg-white rounded-2xl p-6">
      <div className="">
        <BackButton />
      </div>
      <div className="">
        <TitleAndDescription
          title={isEdit ? "Edit Customer Loan" : "Add New Customer Loan"}
          description="Manage your Customer Loan"
        />
      </div>
      {/* Formik */}
      <Formik
        initialValues={initialObject}
        validationSchema={createCustomerLoanSchema}
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
                columns={2}
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
