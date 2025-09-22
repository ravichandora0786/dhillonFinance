import Joi from "joi";

// Create User schema
export const createUserSchema = Joi.object({
  email: Joi.string().email().optional(),
  mobileNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Mobile number must be 10 digits",
    }),
  password: Joi.string().min(6).required(),
  roleId: Joi.string().uuid().required(),
  fullName: Joi.string().when("roleId", {
    is: Joi.exist(),
    then: Joi.required(), // parent/teacher ke liye
  }),
  gender: Joi.string()
    .valid("Male", "Female", "Other")
    .when("roleId", { is: Joi.exist(), then: Joi.required() }),
  occupation: Joi.string().optional(),
  aadharNumber: Joi.string().optional(),
});

// Update User schema
export const updateUserSchema = Joi.object({
  email: Joi.string().email().optional(),
  mobileNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional()
    .messages({
      "string.pattern.base": "Mobile number must be 10 digits",
    }),
  password: Joi.string().min(6).optional(),
  roleId: Joi.string().uuid().optional(),
  fullName: Joi.string().optional(),
  gender: Joi.string().valid("Male", "Female", "Other").optional(),
  occupation: Joi.string().optional(),
  aadharNumber: Joi.string().optional(),
});
