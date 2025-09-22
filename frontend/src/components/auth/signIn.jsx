/**
 *  Sign In Component
 * @format
 */

"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import SchoolIcon from "@mui/icons-material/School";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import InputBox from "@/components/ui/inputBox";
import Label from "@/components/ui/label";
import LoadingButton from "@/components/ui/loadingButton";
import { UserFields } from "@/constants/fieldsName";
import { loginSchema } from "@/validationSchema/authValidationSchema";
import {
  loginApp,
  setClassOptions,
  setSectionOptions,
} from "@/app/common/slice";
import { ProtectedRoutes } from "@/Services/routes";
import { getAllSectionDataList } from "@/app/section/slice";
import { getAllClassDataList } from "@/app/class/slice";

export default function SignIn() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const initialValues = {
    [UserFields.EMAIL]: "ravikumar62843@gmail.com",
    [UserFields.PASSWORD]: "Test@1234",
  };

  const [initialObject, setInitialObject] = useState(initialValues);

  const handleSubmitData = async (values, actions) => {
    setButtonLoading(true);
    await new Promise((resolve, reject) => {
      dispatch(
        loginApp({
          data: values,
          onSuccess: (response) => {
            toast.success(response?.message);
            actions.setSubmitting(false);
            resolve();
            setButtonLoading(false);
            router.push(ProtectedRoutes?.DASHBOARD);
          },
          onFailure: (error) => {
            actions.setSubmitting(false);
            reject(new Error(error));
            setButtonLoading(false);
          },
        })
      );
    });
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/5 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md border border-primary/20 p-6">
          {/* Logo / Title */}
          <div className="text-center space-y-3 mb-6">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <SchoolIcon className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-primary">School Portal</h2>
            <p className="text-muted-foreground">
              Sign in to access your school account
            </p>
          </div>

          <Formik
            initialValues={initialObject}
            enableReinitialize={true}
            validationSchema={loginSchema}
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
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Email Address</Label>
                    <div className="relative">
                      <MailOutlineIcon className="absolute left-3 top-2 w-5 h-5 text-muted-foreground" />
                      <InputBox
                        id={UserFields.EMAIL}
                        name={UserFields.EMAIL}
                        type={"text"}
                        placeholder="Enter your email"
                        className="pl-10"
                        value={values[UserFields.EMAIL]}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFieldValue(UserFields.EMAIL, value);
                        }}
                        error={errors[UserFields.EMAIL]}
                        touched={touched[UserFields.EMAIL]}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Password</Label>
                    <div className="relative">
                      <LockOutlinedIcon className="absolute left-3 top-2 w-5 h-5 text-muted-foreground" />
                      <InputBox
                        id={UserFields.PASSWORD}
                        name={UserFields.PASSWORD}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-10 pr-10"
                        value={values[UserFields.PASSWORD]}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFieldValue(UserFields.PASSWORD, value);
                        }}
                        error={errors[UserFields.PASSWORD]}
                        touched={touched[UserFields.PASSWORD]}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <VisibilityOff className="w-5 h-5" />
                        ) : (
                          <Visibility className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember + Forgot */}
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-primary/30"
                      />
                      <span className="text-muted-foreground">Remember me</span>
                    </label>
                    <a
                      href="#"
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      Forgot password?
                    </a>
                  </div>

                  {/* Button */}
                  <LoadingButton
                    type="submit"
                    disabled={buttonLoading}
                    isLoading={buttonLoading}
                  >
                    Sign In
                  </LoadingButton>
                </form>
              </>
            )}
          </Formik>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <a
                href="#"
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Contact your administrator
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
