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

const validationSchema = Yup.object({
  [UserFields.EMAIL]: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
});

const SendMailForgotPasswordComponent = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const initialValues = fields.reduce((acc, f) => {
    acc[f.name] = "";
    return acc;
  }, {});

  const handleSubmitData = async (values) => {
    setButtonLoading(true);
    setSubmittedEmail(values.email);

    await new Promise((resolve, reject) => {
      dispatch(
        sendMailForgotPassword({
          data: values,
          onSuccess: (response) => {
            toast.success(response?.message || "Email sent successfully!");
            setEmailSent(true);
            setButtonLoading(false);
            resolve();
          },
          onFailure: (error) => {
            toast.error(error || "Something went wrong");
            setButtonLoading(false);
            reject(error);
          },
        })
      );
    });
  };

  const handleResend = async () => {
    if (!submittedEmail) {
      toast.error("No email found. Please enter your email again.");
      setEmailSent(false);
      return;
    }

    setButtonLoading(true);
    await new Promise((resolve, reject) => {
      dispatch(
        sendMailForgotPassword({
          data: { email: submittedEmail },
          onSuccess: () => {
            toast.success("Verification mail resent successfully!");
            setButtonLoading(false);
            resolve();
          },
          onFailure: (error) => {
            toast.error(error || "Failed to resend email");
            setButtonLoading(false);
            reject(error);
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

      <div className="flex flex-row justify-center items-center w-full h-[400px]">
        {!emailSent ? (
          // ========================= FORM =========================
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
                      Send Mail
                    </LoadingButton>
                  </div>
                </div>
              </form>
            )}
          </Formik>
        ) : (
          // ===================== SUCCESS MESSAGE =====================
          <div className="flex flex-col items-center text-center border p-6 rounded-md max-w-lg bg-gray-50 shadow-sm">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              Check your email
            </h2>
            <p className="text-gray-600 mb-6">
              We’ve sent a password reset link to{" "}
              <span className="font-medium text-primary">
                {submittedEmail || "your mail"}
              </span>
              . Please check your inbox and follow the link to reset your
              password.
            </p>

            <div className="flex gap-4">
              <LoadingButton
                type="button"
                variant="secondary"
                isLoading={buttonLoading}
                disabled={buttonLoading}
                onClick={handleResend}
              >
                Resend
              </LoadingButton>

              <LoadingButton
                type="button"
                variant="primary"
                onClick={() => router.push("/login")}
              >
                Done
              </LoadingButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SendMailForgotPasswordComponent;
