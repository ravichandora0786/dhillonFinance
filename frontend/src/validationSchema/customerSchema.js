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

/**
 * Reusable file validation schema generator
 */
const fileValidation = (isRequired = false, fieldName = "file") => {
  let schema = Yup.mixed().test(
    "fileCheck",
    "Please select a valid file under 100KB (only JPG or PNG)",
    (value) => {
      // Allow empty value if field is not required
      if (!value) return !isRequired;

      // Allow already uploaded file IDs (string)
      if (typeof value === "string" && value.trim() !== "") return true;

      // Validate file object
      if (value instanceof File) {
        const isValidSize = value.size <= 100 * 1024; // 100 KB
        const isValidType = ["image/jpeg", "image/png"].includes(value.type);
        return isValidSize && isValidType;
      }

      return false;
    }
  );

  // Add required rule only if needed
  if (isRequired) {
    schema = schema.required(`${fieldName} is required`);
  } else {
    schema = schema.notRequired();
  }

  return schema;
};

/**
 * Customer creation validation schema
 */
export const createCustomerSchema = Yup.object().shape({
  [CustomerFields.FIRST_NAME]: Yup.string()
    .matches(new RegExp(ALPHABETIC_REGEX), "Only alphabets are allowed")
    .required("First Name is required"),

  [CustomerFields.LAST_NAME]: Yup.string()
    .matches(new RegExp(ALPHABETIC_REGEX), "Only alphabets are allowed")
    .nullable(),

  [CustomerFields.MOBILE_NUMBER]: Yup.string()
    .matches(new RegExp(PHONE_NUMBER_REGEX), "Enter a valid mobile number")
    .min(10, "Mobile number must be 10 digits")
    .max(10, "Mobile number must be 10 digits")
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
    .min(6, "PIN Code must be 6 digits")
    .max(6, "PIN Code must be 6 digits")
    .required("Pin Code is required"),

  [CustomerFields.AADHAR_NUMBER]: Yup.string()
    .matches(new RegExp(AADHAR_REGEX), "Enter valid 12-digit Aadhar Number")
    .min(14, "Aadhar Number must be 12 digits")
    .max(14, "Aadhar Number must be 12 digits")
    .required("Aadhar Number is required"),

  [CustomerFields.PAN_CARD_NUMBER]: Yup.string()
    .matches(PAN_CARD_REGEX, {
      message: "Enter valid PAN Card Number (e.g. ABCDE1234F)",
      excludeEmptyString: true,
    })
    .nullable()
    .notRequired(),
  [CustomerFields.VEHICLE_NUMBER]: Yup.string()
    .matches(
      new RegExp(ALPHANUMERIC_REGEX),
      "Only alphabets and numbers allowed"
    )
    .required("Vehicle Number is required"),

  // Image fields
  [CustomerFields.PROFILE_IMAGE]: fileValidation(
    true,
    CustomerFields.PROFILE_IMAGE
  ),
  [CustomerFields.AADHAR_IMAGE]: fileValidation(
    true,
    CustomerFields.AADHAR_IMAGE
  ),
  [CustomerFields.PAN_CARD_IMAGE]: fileValidation(
    false,
    CustomerFields.PAN_CARD_IMAGE
  ),
  [CustomerFields.AGREEMENT_IMAGE]: fileValidation(
    false,
    CustomerFields.AGREEMENT_IMAGE
  ),
  [CustomerFields.ANY_PRUF_IMAGE]: fileValidation(
    true,
    CustomerFields.ANY_PRUF_IMAGE
  ),

  [CommonFields.STATUS]: Yup.string().required("Status is required"),
});
