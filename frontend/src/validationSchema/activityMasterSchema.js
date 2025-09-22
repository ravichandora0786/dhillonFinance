/**
 * ActivityMaster Validation Schema
 */

import * as Yup from "yup";
import { ActivityMasterFields } from "@/constants/fieldsName";

export const createActivityMasterSchema = Yup.object({
  [ActivityMasterFields.NAME]: Yup.string()
    .trim()
    .min(1, "ActivityMaster name is required")
    .required("ActivityMaster name is required"),
  [ActivityMasterFields.STATUS]: Yup.string().required("Status is required"),
});
