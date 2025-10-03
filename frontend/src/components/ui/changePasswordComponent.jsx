"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Formik } from "formik";
import * as Yup from "yup";

import LoadingButton from "@/components/ui/loadingButton";
import {
  ActivityMasterFields,
  CommonFields,
  UserFields,
} from "@/constants/fieldsName";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import GenericModal from "@/components/ui/genericModal";
import RenderFields from "./renderFields";
import { logoutApp, resetPassword } from "@/app/common/slice";

// Field Configuration Array
const fields = [
  {
    name: UserFields.OLD_PASSWORD,
    label: "Old Password",
    type: "password",
    required: true,
    disabled: false,
  },
  {
    name: UserFields.NEW_PASSWORD,
    label: "New Password",
    type: "password",
    required: true,
    disabled: false,
  },
  {
    name: UserFields.CONFIRM_NEW_PASSWORD,
    label: "Confirm New Password",
    type: "password",
    required: true,
    disabled: false,
  },
];

const ChangePasswordComponent = ({ openModal, onBack = () => {}, data }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const initialValues = fields.reduce((acc, f) => {
    acc[f.name] = "";
    return acc;
  }, {});

  //  Validation Schema
  const validationSchema = Yup.object().shape({
    [UserFields.OLD_PASSWORD]: Yup.string().required(
      "Old password is required"
    ),
    [UserFields.NEW_PASSWORD]: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("New password is required"),
    [UserFields.CONFIRM_NEW_PASSWORD]: Yup.string()
      .oneOf([Yup.ref(UserFields.NEW_PASSWORD), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  // Initial form state from field array
  const [buttonLoading, setButtonLoading] = useState(false);

  const handleSubmitData = async (values) => {
    setButtonLoading(true);
    let filteredValues = structuredClone(values);
    if (filteredValues) {
      delete filteredValues?.[UserFields.CONFIRM_NEW_PASSWORD];
    }
    await new Promise((resolve, reject) => {
      dispatch(
        resetPassword({
          data: filteredValues,
          onSuccess: ({ message }) => {
            toast.success(message);
            resolve();
            setButtonLoading(false);
            onBack();
            dispatch(logoutApp());
          },
          onFailure: (error) => {
            reject(new Error(error));
            setButtonLoading(false);
          },
        })
      );
    });
  };

  return (
    <GenericModal
      showModal={openModal}
      closeModal={onBack}
      modalTitle={"Change Password"}
      modalBody={
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
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
                      onClick={() => {}}
                    >
                      Save & Submit
                    </LoadingButton>
                  </div>
                </div>
              </form>
            </>
          )}
        </Formik>
      }
    />
  );
};

export default ChangePasswordComponent;
