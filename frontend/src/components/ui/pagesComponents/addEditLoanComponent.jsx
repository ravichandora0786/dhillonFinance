"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";

import LoadingButton from "@/components/ui/loadingButton";
import { CommonFields, LoanFields } from "@/constants/fieldsName";
import RenderFields from "@/components/ui/renderFields";
import { selectCustomerLoanPagination } from "@/app/loan/selector";
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
import FullScreenLoader from "@/components/ui/fullScreenLoader";
import { loanStatusOptions } from "@/constants/dropdown";

const AddEditCustomerLoanComponent = ({
  customerLoanId,
  isEdit,
  customerId = null,
}) => {
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
      disabled: customerId ? true : false,
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
      onChange: (e, setFieldValue, values) => {
        const value = e.target.value;
        setFieldValue(LoanFields.PRINCIPAL_AMOUNT, value);

        const principal = parseFloat(value || 0);
        const months = parseInt(values[LoanFields.MONTHS] || 0);
        const interestRate = parseFloat(values[LoanFields.INTREST_RATE] || 0);

        if (principal > 0 && months > 0 && interestRate >= 0) {
          const totalInterest = ((principal * interestRate) / 100) * months;
          const totalPay = principal + totalInterest;
          const emi = totalPay / months;

          setFieldValue(LoanFields.TOTAL_PAY_AMOUNT, totalPay.toFixed(2));
          setFieldValue(LoanFields.EMI_AMOUNT, emi.toFixed(2));
        }
      },
    },
    {
      name: LoanFields.INTREST_RATE,
      label: "Interest Rate",
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

        // Allow dot or numpad decimal (.)
        if (e.key === "." || e.key === "Decimal") {
          if (value.includes(".")) {
            e.preventDefault(); // Prevent multiple dots
          }
          return;
        }

        // Allow only digits (0-9)
        if (!/^[0-9]$/.test(e.key)) {
          e.preventDefault();
        }
      },
      onChange: (e, setFieldValue, values) => {
        const value = e.target.value;
        setFieldValue(LoanFields.INTREST_RATE, value);

        const principal = parseFloat(values[LoanFields.PRINCIPAL_AMOUNT] || 0);
        const months = parseInt(values[LoanFields.MONTHS] || 0);
        const interestRate = parseFloat(value || 0);

        if (principal > 0 && months > 0 && interestRate >= 0) {
          const totalInterest = ((principal * interestRate) / 100) * months;
          const totalPay = principal + totalInterest;
          const emi = totalPay / months;

          setFieldValue(LoanFields.TOTAL_PAY_AMOUNT, totalPay.toFixed(2));
          setFieldValue(LoanFields.EMI_AMOUNT, emi.toFixed(2));
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
      onChange: (e, setFieldValue, values) => {
        const value = e.target.value;
        setFieldValue(LoanFields.MONTHS, value);

        const months = parseInt(value || 0);
        const principal = parseFloat(values[LoanFields.PRINCIPAL_AMOUNT] || 0);
        const interestRate = parseFloat(values[LoanFields.INTREST_RATE] || 0);
        const startDate = values[LoanFields.START_DATE]
          ? new Date(values[LoanFields.START_DATE])
          : null;

        // Recalculate totalPayAmount & EMI
        if (principal > 0 && months > 0 && interestRate >= 0) {
          const totalInterest = ((principal * interestRate) / 100) * months;
          const totalPay = principal + totalInterest;
          const emi = totalPay / months;

          setFieldValue(LoanFields.TOTAL_PAY_AMOUNT, totalPay.toFixed(2));
          setFieldValue(LoanFields.EMI_AMOUNT, emi.toFixed(2));
        }

        // Recalculate End Date & next Installment Date if Start Date exists
        if (startDate && !isNaN(startDate.getTime()) && months > 0) {
          const endDate = new Date(startDate);
          endDate.setMonth(endDate.getMonth() + months);
          setFieldValue(
            LoanFields.END_DATE,
            endDate.toISOString().split("T")[0]
          );

          const nextInstallDate = new Date(startDate);
          nextInstallDate.setMonth(nextInstallDate.getMonth() + 1);
          setFieldValue(
            LoanFields.PAY_INSTALLMENT_DATE,
            nextInstallDate.toISOString().split("T")[0]
          );
        }
      },
    },
    {
      name: LoanFields.TOTAL_PAY_AMOUNT,
      label: "Loan Amount",
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
      name: LoanFields.EMI_AMOUNT,
      label: "EMI per month",
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
      name: LoanFields.START_DATE,
      label: "Start Date",
      type: "date",
      required: true,
      disabled: false,
      dateMode: "single",
      minDate: "",
      onChange: (date, setFieldValue, values) => {
        const startDate = new Date(date);
        const months = parseInt(values?.[LoanFields.MONTHS], 10);

        // Check if months is a valid positive number
        if (!months || isNaN(months) || months <= 0) {
          // Show warning toast
          toast.error(
            "Please fill in No. of Installments before selecting Start Date"
          );
          return;
        }

        setFieldValue(LoanFields.START_DATE, date);

        if (startDate && !isNaN(startDate.getTime())) {
          // calculate end date
          const endDate = new Date(startDate);
          endDate.setMonth(endDate.getMonth() + months);
          const formattedEndDate = endDate.toISOString().split("T")[0];

          // calculate next installment date (1 month after start)
          const nextInstallDate = new Date(startDate);
          nextInstallDate.setMonth(nextInstallDate.getMonth() + 1);
          const formattedInstallDate = nextInstallDate
            .toISOString()
            .split("T")[0];

          setFieldValue(LoanFields.PAY_INSTALLMENT_DATE, formattedInstallDate);
          setFieldValue(LoanFields.END_DATE, formattedEndDate);
        }
      },
    },
    {
      name: LoanFields.END_DATE,
      label: "End Date",
      type: "date",
      required: true,
      disabled: true,
      dateMode: "single",
      minDate: "",
    },
    {
      name: LoanFields.PAY_INSTALLMENT_DATE,
      label: "Recovery EMI Date",
      type: "date",
      required: true,
      disabled: true,
      dateMode: "single",
      minDate: "",
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
      type: "select",
      options: loanStatusOptions,
      required: true,
      disabled: false,
    },
  ];

  const initialValues = fields.reduce((acc, f) => {
    if (f.name === CommonFields.STATUS) {
      acc[f.name] = "Active";
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

  useEffect(() => {
    if (customerId) {
      setInitialObject((prev) => ({
        ...prev,
        [CommonFields.CUSTOMER_ID]: customerId,
      }));
    }
  }, [customerId]);

  return (
    <>
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
      <FullScreenLoader showLoader={buttonLoading} message="Please Wait..." />
    </>
  );
};

export default AddEditCustomerLoanComponent;
