"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Formik, useFormikContext } from "formik";

import LoadingButton from "@/components/ui/loadingButton";
import { CommonFields, UserFields } from "@/constants/fieldsName";
import RenderFields from "@/components/ui/renderFields";
import { selectUserData, selectUserPagination } from "@/app/user/selector";
import {
  createUser,
  getUserDetailById,
  setUserPagination,
  updateUser,
} from "@/app/user/slice";
import TitleAndDescription from "../titleAndDescription";
import { getUploadedFile, imageUpload } from "@/app/common/slice";
import InputBox from "../inputBox";
import BackButton from "../backButton";
import { genderOptions } from "@/constants/dropdown";
import { ImPencil } from "react-icons/im";
import { UserProfileUploadImage } from "../userProfileUploardImage";

// Field Configuration Array

const AddEditUserComponent = ({ userId, isEdit }) => {
  const dispatch = useDispatch();
  const navigate = useRouter();

  const fields = [
    {
      name: UserFields.NAME,
      label: "Full Name",
      type: "text",
      required: true,
      disabled: false,
    },
    {
      name: UserFields.GENDER,
      label: "Gender",
      type: "select",
      options: genderOptions,
      required: false,
      disabled: false,
    },
    {
      name: UserFields.EMAIL,
      label: "Email",
      type: "text",
      required: true,
      disabled: true,
    },
    {
      name: UserFields.MOBILE_NUMBER,
      label: "Mobile Number",
      type: "text",
      required: true,
      disabled: true,
    },
    {
      name: UserFields.ADDRESS,
      label: "Full Address",
      type: "text",
      required: false,
      disabled: false,
    },
    {
      name: CommonFields.DESCRIPTION,
      label: "Description",
      type: "textarea",
      required: false,
      disabled: false,
    },
  ];
  const initialValues = fields.reduce((acc, f) => {
    if (f.name === CommonFields.IS_ACTIVE) {
      acc[f.name] = true;
    } else {
      acc[f.name] = "";
    }
    return acc;
  }, {});

  // Initial form state from field array
  const [buttonLoading, setButtonLoading] = useState(false);
  const [initialObject, setInitialObject] = useState(initialValues);

  const goBack = () => {
    navigate.push(`/user/profile/${userId}`);
  };

  const handleSubmitData = async (values) => {
    setButtonLoading(true);
    const { actionType, ...restValues } = values;
    let filteredValues = structuredClone(restValues);
    if (values?.actionType == "ADD") {
      // await new Promise((resolve, reject) => {
      //   dispatch(
      //     createUser({
      //       data: filteredValues,
      //       onSuccess: (response) => {
      //         toast.success(response?.message);
      //         resolve();
      //         dispatch(setUserPagination({ pageIndex: 0, pageSize: 10 }));
      //         goBack();
      //         setButtonLoading(false);
      //       },
      //       onFailure: (error) => {
      //         reject(new Error(error));
      //         setButtonLoading(false);
      //       },
      //     })
      //   );
      // });
    } else if (values?.actionType == "UPDATE") {
      if (filteredValues) {
        delete filteredValues?.id;
      }
      await new Promise((resolve, reject) => {
        dispatch(
          updateUser({
            id: values.id,
            data: filteredValues,
            onSuccess: (response) => {
              toast.success(response?.message);
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

  const getUserDetails = (id) => {
    dispatch(
      getUserDetailById({
        id,
        onSuccess: ({ message, data }) => {
          console.log(message);
          if (data) {
            const obj = {
              [CommonFields.ID]: data[CommonFields.ID],
              [UserFields.NAME]: data[UserFields.NAME],
              [UserFields.MOBILE_NUMBER]: data[UserFields.MOBILE_NUMBER],
              [UserFields.ADDRESS]: data[UserFields.ADDRESS],
              [UserFields.PROFILE_IMAGE]: data[UserFields.PROFILE_IMAGE],
              [UserFields.DATE_OF_BIRTH]: data[UserFields.DATE_OF_BIRTH],
              [UserFields.EMAIL]: data[UserFields.EMAIL],
              [UserFields.GENDER]: data[UserFields.GENDER],
              [CommonFields.DESCRIPTION]: data[CommonFields.DESCRIPTION],
              [CommonFields.IS_ACTIVE]: data[CommonFields.IS_ACTIVE],
            };

            setInitialObject(obj);
          }
        },
        onFailure: () => {},
      })
    );
  };

  useEffect(() => {
    if (userId) {
      getUserDetails(userId);
    }
  }, [userId, dispatch]);

  useEffect(() => {}, []);
  return (
    <div className="flex flex-col gap-6 justify-start w-full mx-auto bg-white rounded-2xl p-6">
      <div className="">
        <BackButton />
      </div>
      <div className="">
        <TitleAndDescription
          title={isEdit ? "Edit User" : "Add New User"}
          description=""
        />
      </div>
      {/* Formik */}
      <Formik
        initialValues={initialObject}
        // validationSchema={createUserSchema}
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
            <form onSubmit={handleSubmit} className="">
              <div>
                <UserProfileUploadImage
                  fileId={values[UserFields.PROFILE_IMAGE]}
                  userId={userId}
                  fieldName={UserFields.PROFILE_IMAGE}
                />
              </div>
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
  );
};

export default AddEditUserComponent;
