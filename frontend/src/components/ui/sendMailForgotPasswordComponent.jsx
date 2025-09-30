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
import {
  logoutApp,
  resetPassword,
  sendMailForgotPassword,
} from "@/app/common/slice";
import BackButton from "./backButton";
import TitleAndDescription from "./titleAndDescription";

// Field Configuration Array
const fields = [
  {
    name: UserFields.EMAIL,
    label: "Email",
    type: "text",
    required: true,
    disabled: false,
  },
];

const SendMailForgotPasswordComponent = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const initialValues = fields.reduce((acc, f) => {
    acc[f.name] = "";
    return acc;
  }, {});

  // Initial form state from field array
  const [buttonLoading, setButtonLoading] = useState(false);

  const handleSubmitData = async (values) => {
    setButtonLoading(true);

    await new Promise((resolve, reject) => {
      dispatch(
        sendMailForgotPassword({
          data: values,
          onSuccess: (response) => {
            toast.success(response?.message);
            resolve();
            setButtonLoading(false);
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
          // validationSchema={}
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

export default SendMailForgotPasswordComponent;
