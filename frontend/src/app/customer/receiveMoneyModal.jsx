"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import { toast } from "react-toastify";

import GenericModal from "@/components/ui/genericModal";
import { CommonFields, TransactionFields } from "@/constants/fieldsName";
import { createTransaction } from "@/app/transaction/slice";
import LoadingButton from "@/components/ui/loadingButton";
import RenderFields from "@/components/ui/renderFields";
import { getCustomerListForOptions } from "./slice";

const ReceiveMoneyModal = ({
  openModal,
  onBack = () => {},
  data,
  callBackFunc = () => {},
}) => {
  const dispatch = useDispatch();
  const isEdit = Object.keys(data)?.length > 0;
  const customer = data;
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
      options: [
        { label: "Cash", value: "Cash" },
        { label: "Bank", value: "Bank" },
        { label: "UPI", value: "UPI" },
        { label: "Cheque", value: "Cheque" },
      ],
      required: true,
      disabled: false,
    },
    {
      name: TransactionFields.TRANSACTION_DATE,
      label: "Date",
      type: "date",
      required: true,
      disabled: false,
    },
    {
      name: CommonFields.DESCRIPTION,
      label: "Description",
      type: "text",
      required: false,
      disabled: false,
    },
  ];

  // Step 1: sabhi fields se initial values banao
  let initialValues = fields.reduce((acc, f) => {
    if (f.name === CommonFields.IS_ACTIVE) {
      acc[f.name] = false;
    } else {
      acc[f.name] = "";
    }
    return acc;
  }, {});

  const [buttonLoading, setButtonLoading] = useState(false);
  const [initialObject, setInitialObject] = useState(initialValues);

  const handleSubmitData = async (values) => {
    setButtonLoading(true);
    const { ...restValues } = values;
    let filteredValues = structuredClone(restValues);
    await new Promise((resolve, reject) => {
      dispatch(
        createTransaction({
          data: filteredValues,
          onSuccess: (response) => {
            toast.success(response?.message);
            resolve();
            setButtonLoading(false);
            callBackFunc();
            onBack();
          },
          onFailure: (error) => {
            reject(new Error(error));
            setButtonLoading(false);
          },
        })
      );
    });
  };

  useEffect(() => {
    if (customer?.id) {
      const defaultValues = {
        [CommonFields.CUSTOMER_ID]: customer.id,
        [TransactionFields.TRANSACTION_TYPE]: "Repayment",
        [CommonFields.IS_ACTIVE]: true,
      };

      // fields se initial values banao
      let initialValues = fields.reduce((acc, f) => {
        acc[f.name] = "";
        return acc;
      }, {});

      // merge defaults
      setInitialObject({ ...initialValues, ...defaultValues });
    } else {
      const defaultValues = {
        [TransactionFields.TRANSACTION_TYPE]: "Repayment",
        [CommonFields.IS_ACTIVE]: true,
      };

      // fields se initial values banao
      let initialValues = fields.reduce((acc, f) => {
        acc[f.name] = "";
        return acc;
      }, {});

      // merge defaults
      setInitialObject({ ...initialValues, ...defaultValues });
    }
  }, [customer]);

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
    <GenericModal
      showModal={openModal}
      closeModal={onBack}
      modalTitle={`Receive Money from ${customer?.firstName} ${customer?.lastName}`}
      modalBody={
        <Formik
          initialValues={initialObject}
          //   validationSchema={}
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
  );
};

export default ReceiveMoneyModal;
