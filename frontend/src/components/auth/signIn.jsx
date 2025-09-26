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
import { loginApp } from "@/app/common/slice";
import { ProtectedRoutes } from "@/Services/routes";
import Link from "next/link";

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
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/5 flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md border border-primary/20 p-4 sm:p-6">
          {/* Logo / Title */}
          <div className="text-center space-y-3 mb-6">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <SchoolIcon className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-primary">
              Dhillon Finance
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              {" "}
              Sign in to access your account{" "}
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
            }) => (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Email Address</Label>
                  <div className="relative">
                    <MailOutlineIcon className="absolute left-3 top-2 w-5 h-5 text-muted-foreground" />
                    <InputBox
                      id={UserFields.EMAIL}
                      name={UserFields.EMAIL}
                      type="text"
                      placeholder="Enter your email"
                      className="pl-10 pr-3 w-full"
                      value={values[UserFields.EMAIL]}
                      onChange={(e) =>
                        setFieldValue(UserFields.EMAIL, e.target.value)
                      }
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
                      className="pl-10 pr-10 w-full"
                      value={values[UserFields.PASSWORD]}
                      onChange={(e) =>
                        setFieldValue(UserFields.PASSWORD, e.target.value)
                      }
                      error={errors[UserFields.PASSWORD]}
                      touched={touched[UserFields.PASSWORD]}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <VisibilityOff className="w-5 h-5 sm:w-6 sm:h-6" />
                      ) : (
                        <Visibility className="w-5 h-5 sm:w-6 sm:h-6" />
                      )}
                    </button>
                  </div>
                </div>
                {/* Remember + Forgot */}
                <div className="flex flex-row sm:flex-row items-center justify-between text-sm space-y-2 sm:space-y-0 sm:space-x-2">
                  {/* <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-primary/30"
                    />
                    <span className="text-muted-foreground">Remember me</span>
                  </label> */}
                  <div></div>
                  <Link
                    href="#"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                {/* Button */}
                <LoadingButton
                  type="submit"
                  disabled={buttonLoading}
                  isLoading={buttonLoading}
                  className="w-full"
                >
                  Sign In
                </LoadingButton>
              </form>
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
