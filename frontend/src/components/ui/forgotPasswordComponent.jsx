"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import {
  logoutApp,
  resetForgotPassword,
  resetPassword,
  sendMailForgotPassword,
} from "@/app/common/slice";
import BackButton from "./backButton";
import TitleAndDescription from "./titleAndDescription";

// Field Configuration Array
const fields = [
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

const ForgotPasswordComponent = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const initialValues = fields.reduce((acc, f) => {
    acc[f.name] = "";
    return acc;
  }, {});
  const validationSchema = Yup.object().shape({
    [UserFields.NEW_PASSWORD]: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("New Password is required"),
    [UserFields.CONFIRM_NEW_PASSWORD]: Yup.string()
      .oneOf([Yup.ref(UserFields.NEW_PASSWORD), null], "Passwords must match")
      .required("Confirm Password is required"),
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
        resetForgotPassword({
          data: { ...filteredValues, token },
          onSuccess: ({ message}) => {
            toast.success(message);
            resolve();
            setButtonLoading(false);
            router.push("/login");
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
    <div className="flex flex-col gap-6 justify-start w-full mx-auto bg-white rounded-2xl p-6">
      <div className="">
        <BackButton />
      </div>
      {/* <div className="w-full"> */}
      <div className=" flex flex-row justify-center items-center w-full h-[400px]">
        {/* Formik */}
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
              <form
                onSubmit={handleSubmit}
                className="w-[70vw] border p-4 rounded-md max-w-2xl max-sm:max-w-[90vw] max-md:max-w-[90vw]"
              >
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
                        router.push("/login");
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
      </div>
      {/* </div> */}
    </div>
  );
};

export default ForgotPasswordComponent;
