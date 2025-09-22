/**
 * Role Validation Schema
 */

import * as Yup from "yup";
import { RoleFields } from "@/constants/fieldsName";

export const createRoleSchema = Yup.object({
  [RoleFields.NAME]: Yup.string()
    .trim()
    .min(1, "Role name is required")
    .required("Role name is required"),
  [RoleFields.STATUS]: Yup.string().required("Status is required"),
  [RoleFields.DESCRIPTION]: Yup.string().optional("Description is required"),
});
