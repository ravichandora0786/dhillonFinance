"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import { toast } from "react-toastify";

import GenericModal from "@/components/ui/genericModal";
import { CommonFields, TransactionFields } from "@/constants/fieldsName";
import {
  createTransaction,
  getTransactionDetailById,
  updateTransaction,
} from "@/app/transaction/slice";
import LoadingButton from "@/components/ui/loadingButton";
import RenderFields from "@/components/ui/renderFields";
import FullScreenLoader from "@/components/ui/fullScreenLoader";
import { todayDate } from "@/Services/utils";
import { paymentModeOptions } from "@/constants/dropdown";

const EditTransactionModal = ({
  openModal,
  onBack = () => {},
  data,
  callBackFunc = () => {},
  isEdit = false,
  installmentDate,
}) => {
  const dispatch = useDispatch();
  const transation = data;
  const [showLateField, setShowLateField] = useState(false);
  const today = todayDate().toISOString().split("T")[0];
  const [buttonLoading, setButtonLoading] = useState(false);

  // ------- Fields -------
  const fields = useMemo(() => {
    const baseFields = [
      {
        name: TransactionFields.AMOUNT,
        label: "Amount",
        type: "text",
        required: true,
      },
      {
        name: TransactionFields.PAYMENT_MODE,
        label: "Payment Type",
        type: "select",
        options: paymentModeOptions,
        required: true,
      },
      {
        name: TransactionFields.TRANSACTION_DATE,
        label: "Transaction Date",
        type: "date",
        required: true,
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
      },
    ];

    if (showLateField) {
      baseFields.push({
        name: TransactionFields.PER_DAY_CHARGES,
        label: "Per Day Late Charge (₹)",
        type: "text",
      });
    }

    return baseFields;
  }, [showLateField, installmentDate]);

  // ------- Initial Data -------
  const [initialObject, setInitialObject] = useState({
    [TransactionFields.AMOUNT]: "",
    [TransactionFields.PAYMENT_MODE]: "",
    [TransactionFields.TRANSACTION_DATE]: today,
    [TransactionFields.PER_DAY_CHARGES]: 0,
    [CommonFields.DESCRIPTION]: "",
  });

  useEffect(() => {
    if (isEdit && transation?.id) {
      dispatch(
        getTransactionDetailById({
          id: transation.id,
          onSuccess: ({ data }) => {
            if (data) {
              setInitialObject({
                [CommonFields.ID]: data[CommonFields.ID],
                [CommonFields.CUSTOMER_ID]: data[CommonFields.CUSTOMER_ID],
                [TransactionFields.AMOUNT]:
                  data[TransactionFields.AMOUNT] || "",
                [TransactionFields.PAYMENT_MODE]:
                  data[TransactionFields.PAYMENT_MODE] || "",
                [TransactionFields.TRANSACTION_DATE]:
                  data[TransactionFields.TRANSACTION_DATE]?.split("T")[0] ||
                  today,
                [TransactionFields.PER_DAY_CHARGES]:
                  data[TransactionFields.PER_DAY_CHARGES] || 0,
                [CommonFields.DESCRIPTION]:
                  data[CommonFields.DESCRIPTION] || "",
                [TransactionFields.TRANSACTION_TYPE]:
                  data[TransactionFields.TRANSACTION_TYPE],
                [CommonFields.IS_ACTIVE]: data[CommonFields.IS_ACTIVE],
              });
            }
          },
        })
      );
    }
  }, [isEdit, transation]);

  // ------- Submit Handler -------
  const handleSubmitData = async (values) => {
    setButtonLoading(true);

    const payload = { ...values };

    const apiAction = isEdit ? updateTransaction : createTransaction;

    await new Promise((resolve, reject) => {
      dispatch(
        apiAction({
          id: isEdit ? transation?.id : undefined,
          data: payload,
          onSuccess: (response) => {
            toast.success(
              response?.message ||
                (isEdit ? "Transaction updated!" : "Transaction created!")
            );
            setButtonLoading(false);
            callBackFunc();
            onBack();
            resolve();
          },
          onFailure: (error) => {
            toast.error(error || "Something went wrong!");
            setButtonLoading(false);
            reject(error);
          },
        })
      );
    });
  };

  // ------- JSX -------
  return (
    <>
      <GenericModal
        showModal={openModal}
        closeModal={onBack}
        modalTitle={isEdit ? "Edit Transaction" : "New Transaction"}
        modalBody={
          <Formik
            initialValues={initialObject}
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

                  <div>
                    <LoadingButton
                      type="submit"
                      isLoading={buttonLoading}
                      disabled={buttonLoading}
                    >
                      {isEdit ? "Update" : "Receive Money"}
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

export default EditTransactionModal;
