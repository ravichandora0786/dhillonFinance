/**
 *  Auth Validation Schema
 */

import * as Yup from "yup";
import { STRONG_PASSWORD_REGEX } from "@/Services/regexPatterns";

export const loginSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),

  password: Yup.string()
    .required("Password is required")
    .matches(
      new RegExp(STRONG_PASSWORD_REGEX),
      "Password must be at least 8 characters, include uppercase, lowercase, number and special character"
    ),
});
