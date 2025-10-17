"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import { toast } from "react-toastify";

import GenericModal from "@/components/ui/genericModal";
import { CommonFields, TransactionFields } from "@/constants/fieldsName";
import { createTransaction } from "@/app/transaction/slice";
import LoadingButton from "@/components/ui/loadingButton";
import RenderFields from "@/components/ui/renderFields";
import { getCustomerListForOptions } from "@/app/customer/slice";
import FullScreenLoader from "@/components/ui/fullScreenLoader";
import { receiveMoneyValidationSchema } from "@/validationSchema/loanSchema";
import { todayDate } from "@/Services/utils";
import { paymentModeOptions } from "@/constants/dropdown";

const ReceiveMoneyModal = ({
  openModal,
  onBack = () => {},
  data,
  callBackFunc = () => {},
}) => {
  const dispatch = useDispatch();
  const customer = data;
  const [customerOptions, setCustomerOptions] = useState([]);
  const [installmentDate, setInstallmentDate] = useState(null);
  const [showLateField, setShowLateField] = useState(false);

  const today = todayDate().toISOString().split("T")[0];
  const [buttonLoading, setButtonLoading] = useState(false);

  // Generate fields dynamically
  const fields = useMemo(() => {
    const baseFields = [
      {
        name: CommonFields.CUSTOMER_ID,
        label: "Customer Name",
        type: "select",
        options: customerOptions,
        required: true,
        disabled: !!customer?.id,
      },
      {
        name: TransactionFields.AMOUNT,
        label: "Amount",
        type: "text",
        required: true,
        disabled: false,
      },
      {
        name: TransactionFields.PAYMENT_MODE,
        label: "Payment Type",
        type: "select",
        options: paymentModeOptions,
        required: true,
        disabled: false,
      },
      {
        name: TransactionFields.TRANSACTION_DATE,
        label: "Transaction Date",
        type: "date",
        required: true,
        disabled: false,
        onChange: (date, setFieldValue) => {
          if (installmentDate) {
            const payDate = new Date(date);
            const instDate = new Date(installmentDate);
            if (payDate > instDate) {
              setShowLateField(true);
            } else {
              setShowLateField(false);
              setFieldValue(TransactionFields.PER_DAY_CHARGES, 0);
            }
          }
          setFieldValue(TransactionFields.TRANSACTION_DATE, date);
        },
      },
      {
        name: CommonFields.DESCRIPTION,
        label: "Description",
        type: "text",
        required: false,
        disabled: false,
      },
    ];

    // Late charge field conditionally add karo
    if (showLateField) {
      baseFields.push({
        name: TransactionFields.PER_DAY_CHARGES,
        label: "Per Day Late Charge (₹)",
        type: "text",
        required: false,
        disabled: false,
      });
    }

    return baseFields;
  }, [customerOptions, customer?.id, showLateField, installmentDate]);

  // Initial Values
  const [initialObject, setInitialObject] = useState({});

  useEffect(() => {
    if (customer?.id) {
      const loan = customer?.loans?.[0];
      setInstallmentDate(loan?.installmentDate || null);
      setInitialObject({
        [CommonFields.CUSTOMER_ID]: customer.id,
        [TransactionFields.TRANSACTION_TYPE]: "Repayment",
        [TransactionFields.AMOUNT]: loan?.nextEmiAmount || "",
        [TransactionFields.TRANSACTION_DATE]: today,
        [TransactionFields.PER_DAY_CHARGES]: 0,
        [TransactionFields.PAYMENT_MODE]: "",
        [CommonFields.IS_ACTIVE]: true,
        [CommonFields.DESCRIPTION]: "",
      });
    } else {
      setInitialObject({
        [CommonFields.CUSTOMER_ID]: "",
        [TransactionFields.TRANSACTION_TYPE]: "Repayment",
        [TransactionFields.AMOUNT]: 0,
        [TransactionFields.TRANSACTION_DATE]: "",
        [TransactionFields.PER_DAY_CHARGES]: 0,
        [TransactionFields.PAYMENT_MODE]: "",
        [CommonFields.IS_ACTIVE]: true,
        [CommonFields.DESCRIPTION]: "",
      });
    }
  }, [customer]);

  useEffect(() => {
    dispatch(
      getCustomerListForOptions({
        data: { search: "" },
        onSuccess: ({ data }) => {
          const options = data?.customers?.map((item) => ({
            label: item.name,
            value: item.id,
          }));
          setCustomerOptions(options || []);
        },
      })
    );
  }, [dispatch]);

  const handleSubmitData = async (values) => {
    setButtonLoading(true);
    const filteredValues = { ...values };
    if (!showLateField) filteredValues[TransactionFields.PER_DAY_CHARGES] = 0;

    await new Promise((resolve, reject) => {
      dispatch(
        createTransaction({
          data: filteredValues,
          onSuccess: (response) => {
            toast.success(response?.message);
            setButtonLoading(false);
            callBackFunc();
            onBack();
            resolve();
          },
          onFailure: (error) => {
            toast.error(error);
            setButtonLoading(false);
            reject(error);
          },
        })
      );
    });
  };

  // Automatically show/hide Per Day Charge based on default date
  useEffect(() => {
    if (
      installmentDate &&
      initialObject?.[TransactionFields.TRANSACTION_DATE]
    ) {
      const payDate = new Date(
        initialObject[TransactionFields.TRANSACTION_DATE]
      );
      const instDate = new Date(installmentDate);
      if (payDate > instDate) {
        setShowLateField(true);
      } else {
        setShowLateField(false);
      }
    }
  }, [installmentDate, initialObject?.[TransactionFields.TRANSACTION_DATE]]);

  return (
    <>
      <GenericModal
        showModal={openModal}
        closeModal={onBack}
        modalTitle={`Receive Money ${customer ? "from" : ""} ${
          customer?.firstName || ""
        } ${customer?.lastName || ""}`}
        modalBody={
          <Formik
            initialValues={initialObject}
            validationSchema={receiveMoneyValidationSchema}
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
                        onBack();
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
                    >
                      Receive Money
                    </LoadingButton>
                  </div>
                </div>
              </form>
            )}
          </Formik>
        }
      />
      <FullScreenLoader showLoader={buttonLoading} message="Please Wait..." />
    </>
  );
};

export default ReceiveMoneyModal;
