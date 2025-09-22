import { UserFields } from "@/constants/fieldsName";
import * as Yup from "yup";

export const studentPersonalDetailsValidation = Yup.object({
  [UserFields.YEAR_ID]: Yup.string().required("Academic Year is required"),
  [UserFields.ADMISSION_NUMBER]: Yup.string().required(
    "Admission Number is required"
  ),
  [UserFields.DATE_OF_ADMISSION]: Yup.date()
    .required("Admission Date is required")
    .typeError("Invalid date format"),
  [UserFields.FIRST_NAME]: Yup.string().required("First Name is required"),
  [UserFields.LAST_NAME]: Yup.string(),
  [UserFields.CLASS_ID]: Yup.string().required("Class is required"),
  [UserFields.SECTION_ID]: Yup.string().required("Section is required"),
  [UserFields.GENDER]: Yup.string().required("Gender is required"),
  [UserFields.DATE_OF_BIRTH]: Yup.date()
    .required("Date of Birth is required")
    .typeError("Invalid date format"),
  [UserFields.BLOOD_GROUP]: Yup.string(),
  [UserFields.RELIGION]: Yup.string().required("Religion is required"),
  [UserFields.CATEGORY]: Yup.string().required("Category is required"),
  [UserFields.AADHAR_NUMBER]: Yup.string()
    .matches(/^\d{12}$/, "Aadhar Number must be 12 digits")
    .nullable(),
  [UserFields.PAN_NUMBER]: Yup.string()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN Number format")
    .nullable(),
  [UserFields.MEDIUM]: Yup.string().required("Medium is required"),
  [UserFields.LANGUAGE_KNOWN]: Yup.array().of(Yup.string()).nullable(),
  [UserFields.STATUS]: Yup.string()
    .required("Status is required")
    .oneOf(["Active", "Inactive", "Pending"], "Invalid Status"),
});

export const parentsValidationSchema = Yup.object({
  parents: Yup.array()
    .of(
      Yup.object().shape({
        [UserFields.FULL_NAME]: Yup.string()
          .required("Full name is required")
          .min(2, "Name must be at least 2 characters"),

        [UserFields.EMAIL]: Yup.string()
          .required("Email is required")
          .email("Invalid email address"),

        [UserFields.MOBILE_NUMBER]: Yup.string()
          .required("Mobile number is required")
          .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),

        [UserFields.RELATION]: Yup.string()
          .required("Relation is required")
          .oneOf(["Father", "Mother", "Guardian"], "Invalid relation"),

        [UserFields.GENDER]: Yup.string()
          .required("Gender is required")
          .oneOf(["male", "female", "other"], "Invalid gender"),

        [UserFields.OCCUPATION]: Yup.string()
          .required("Occupation is required")
          .max(50, "Occupation must be at most 50 characters"),

        [UserFields.AADHAR_NUMBER]: Yup.string()
          .required("Aadhar number is required")
          .matches(/^\d{12}$/, "Aadhar number must be 12 digits"),
      })
    )
    .min(1, "At least one parent must be added")
    .test("unique-relation", "Duplicate relation not allowed", (parents) => {
      if (!parents) return true;
      const relations = parents.map((p) => p[UserFields.RELATION]);
      return new Set(relations).size === relations.length;
    })
    .test(
      "relation-limit",
      "You can only add 1 Father, 1 Mother and 1 Guardian",
      (parents) => {
        if (!parents) return true;
        const counts = parents.reduce((acc, p) => {
          acc[p[UserFields.RELATION]] = (acc[p[UserFields.RELATION]] || 0) + 1;
          return acc;
        }, {});
        return (
          (counts["Father"] ?? 0) <= 1 &&
          (counts["Mother"] ?? 0) <= 1 &&
          (counts["Guardian"] ?? 0) <= 1
        );
      }
    ),
});
