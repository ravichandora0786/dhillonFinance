/**
 * Permission Validation Schema
 */

import * as Yup from "yup";
import { PermissionFields } from "@/constants/fieldsName";

export const createPermissionSchema = Yup.object({
  [PermissionFields.NAME]: Yup.string()
    .trim()
    .min(1, "Permission name is required")
    .required("Permission name is required"),
  [PermissionFields.STATUS]: Yup.string().required("Status is required"),
  [PermissionFields.DESCRIPTION]: Yup.string().optional(
    "Description is required"
  ),
});
