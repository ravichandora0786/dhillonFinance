"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Formik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";

import LoadingButton from "@/components/ui/loadingButton";
import InputBox from "@/components/ui/inputBox";
import SelectDropDown from "@/components/ui/selectDropDown";
import { CommonFields, RoleFields } from "@/constants/fieldsName";
import { createRoleSchema } from "@/validationSchema/roleValidationSchema";
import CustomSwitch from "@/components/ui/customSwitch";
import { createRole, updateRole } from "../slice";
import { useDispatch, useSelector } from "react-redux";
import GenericModal from "@/components/ui/genericModal";
import { selectRolePagination, selectRoleSearchData } from "../selector";

// Field Configuration Array
const fields = [
  {
    name: RoleFields.NAME,
    label: "Role Name",
    type: "text",
    required: true,
    disabled: false,
  },
  {
    name: RoleFields.DESCRIPTION,
    label: "Role description",
    type: "text",
    required: false,
    disabled: false,
  },
  {
    name: CommonFields.IS_ACTIVE,
    label: "Active",
    type: "toogle",
    required: true,
    disabled: false,
  },
];

const AddEditRole = ({ openModal, onBack = () => {}, callBackFunc, data }) => {
  const dispatch = useDispatch();
  const isEdit = Object.keys(data)?.length > 0;
  const initialValues = fields.reduce((acc, f) => {
    if (f.name === CommonFields.IS_ACTIVE) {
      acc[f.name] = false;
    } else {
      acc[f.name] = "";
    }
    return acc;
  }, {});

  // Initial form state from field array
  const [buttonLoading, setButtonLoading] = useState(false);
  const [initialObject, setInitialObject] = useState(initialValues);
  const pagination = useSelector(selectRolePagination);
  const roleSearchData = useSelector(selectRoleSearchData);

  const handleSubmitData = async (values) => {
    setButtonLoading(true);
    const { actionType, ...restValues } = values;
    let filteredValues = structuredClone(restValues);
    if (values?.actionType == "ADD") {
      await new Promise((resolve, reject) => {
        dispatch(
          createRole({
            data: filteredValues,
            onSuccess: (response) => {
              toast.success(response?.message);
              resolve();
              setButtonLoading(false);
              callBackFunc(roleSearchData, pagination);
              onBack();
            },
            onFailure: (error) => {
              reject(new Error(error));
              setButtonLoading(false);
            },
          })
        );
      });
    } else if (values?.actionType == "UPDATE") {
      if (filteredValues) {
        delete filteredValues?.id;
      }
      await new Promise((resolve, reject) => {
        dispatch(
          updateRole({
            id: values.id,
            data: filteredValues,
            onSuccess: (response) => {
              toast.success(response?.message);
              resolve();
              onBack();
              setButtonLoading(false);
              callBackFunc(roleSearchData, pagination);
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

  useEffect(() => {
    if (Object.keys(data).length > 0) {
      setInitialObject({
        [RoleFields.ID]: data[RoleFields.ID],
        [RoleFields.NAME]: data[RoleFields.NAME],
        [RoleFields.DESCRIPTION]: data[RoleFields.DESCRIPTION],
        [CommonFields.IS_ACTIVE]: data[CommonFields.IS_ACTIVE],
      });
    } else {
      setInitialObject(initialValues);
    }
  }, [data]);

  return (
    <GenericModal
      showModal={openModal}
      closeModal={onBack}
      modalTitle={isEdit ? "Edit Role" : "Add New Role"}
      modalBody={
        <Formik
          initialValues={initialObject}
          validationSchema={createRoleSchema}
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
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
                {fields.map(
                  ({ name, label, type, required, options, disabled }) => (
                    <>
                      <div key={name}>
                        {type !== "toogle" && (
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {label}{" "}
                            {required && <span className="text-danger">*</span>}
                          </label>
                        )}

                        {/* Render Input or Select based on type */}
                        {type === "select" ? (
                          <SelectDropDown
                            name={name}
                            options={options}
                            value={options.find(
                              (opt) => opt.value === values?.[name]
                            )}
                            onChange={(option) =>
                              setFieldValue(name, option ? option.value : "")
                            }
                            //   required={required}
                            placeholder={`Select ${label}`}
                            isSearchable={true}
                            isClearable={true}
                            touched={touched[name]}
                            error={errors[name]}
                            disabled={disabled}
                          />
                        ) : type === "toogle" ? (
                          <div className="w-full flex flex-row justify-between">
                            <div className="flex flex-col justify-between">
                              <label className="block text-sm font-medium text-gray-700">
                                {label}{" "}
                                {required && (
                                  <span className="text-danger">*</span>
                                )}
                              </label>
                              <span className="text-gray-500 text-sm">
                                Change the {label} by toggle
                              </span>
                            </div>
                            <div>
                              {" "}
                              <CustomSwitch
                                name={name}
                                disabled={disabled}
                                checked={values?.[name]}
                                onChange={(event) => {
                                  setFieldValue(
                                    name,
                                    event.target.checked ? "Active" : "Inactive"
                                  );
                                }}
                              />
                            </div>
                          </div>
                        ) : type === "text" ? (
                          <InputBox
                            type={type}
                            name={name}
                            value={values?.[name]}
                            onChange={(e) => {
                              const value = e.target.value;
                              setFieldValue(name, value);
                            }}
                            //   required={required}
                            placeholder={`Enter ${label}`}
                            error={errors[name]}
                            touched={touched[name]}
                            disabled={disabled}
                            onBlur={handleBlur}
                          />
                        ) : (
                          <></>
                        )}
                      </div>
                    </>
                  )
                )}
              </div>
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
          )}
        </Formik>
      }
    />
  );
};

export default AddEditRole;
