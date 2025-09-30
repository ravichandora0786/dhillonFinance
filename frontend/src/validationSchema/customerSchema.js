import * as Yup from "yup";
import {
  AADHAR_REGEX,
  ALPHABETIC_REGEX,
  ALPHANUMERIC_REGEX,
  PAN_CARD_REGEX,
  PHONE_NUMBER_REGEX,
  INDIAN_PINCODE_REGEX,
} from "@/Services/regexPatterns";

import { CustomerFields, CommonFields } from "@/constants/fieldsName";

// File validation helper (30 KB - 100 KB)
const FILE_SIZE_MIN = 30 * 1024; // 30 KB
const FILE_SIZE_MAX = 100 * 1024; // 100 KB

const fileValidation = Yup.mixed()
  .required("Please upload a file")
  .test("fileCheck", "Please select a valid file under 100KB", (value) => {
    // Agar ID (string) hai to valid hai (already uploaded)
    if (typeof value === "string" && value.trim() !== "") return true;

    // Agar abhi file object hai to uska size/type check karo
    if (value instanceof File) {
      const isValidSize = value.size <= 100 * 1024; // 100KB
      const isValidType = ["image/jpeg", "image/png"].includes(value.type);
      return isValidSize && isValidType;
    }

    return false;
  });

export const createCustomerSchema = Yup.object().shape({
  [CustomerFields.FIRST_NAME]: Yup.string()
    .matches(new RegExp(ALPHABETIC_REGEX), "Only alphabets are allowed")
    .required("First Name is required"),

  [CustomerFields.LAST_NAME]: Yup.string()
    .matches(new RegExp(ALPHABETIC_REGEX), "Only alphabets are allowed")
    .nullable(),

  [CustomerFields.MOBILE_NUMBER]: Yup.string()
    .matches(new RegExp(PHONE_NUMBER_REGEX), "Enter a valid mobile number")
    .required("Mobile Number is required"),

  [CustomerFields.ADDRESS]: Yup.string().required("Address is required"),

  [CustomerFields.STATE]: Yup.string()
    .matches(new RegExp(ALPHABETIC_REGEX), "Only alphabets are allowed")
    .required("State is required"),

  [CustomerFields.CITY]: Yup.string()
    .matches(new RegExp(ALPHABETIC_REGEX), "Only alphabets are allowed")
    .required("City is required"),

  [CustomerFields.PIN_CODE]: Yup.string()
    .matches(new RegExp(INDIAN_PINCODE_REGEX), "Enter valid 6-digit PIN Code")
    .required("Pin Code is required"),

  [CustomerFields.AADHAR_NUMBER]: Yup.string()
    .matches(new RegExp(AADHAR_REGEX), "Enter valid 12-digit Aadhar Number")
    .required("Aadhar Number is required"),

  [CustomerFields.PAN_CARD_NUMBER]: Yup.string()
    .matches(
      new RegExp(PAN_CARD_REGEX),
      "Enter valid PAN Card Number (e.g. ABCDE1234F)"
    )
    .optional(),
  [CustomerFields.VEHICLE_NUMBER]: Yup.string()
    .matches(
      new RegExp(ALPHANUMERIC_REGEX),
      "Only alphabets and numbers allowed"
    )
    .required("Vehicle Number is required"),

  // Image fields
  [CustomerFields.PROFILE_IMAGE]: fileValidation,
  [CustomerFields.AADHAR_IMAGE]: fileValidation,
  [CustomerFields.PAN_CARD_IMAGE]: fileValidation,
  [CustomerFields.AGREEMENT_IMAGE]: fileValidation,
  [CustomerFields.ANY_PRUF_IMAGE]: fileValidation,

  [CommonFields.IS_ACTIVE]: Yup.boolean().required("Status is required"),
});
