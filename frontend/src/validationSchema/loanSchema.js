import * as Yup from "yup";
import { CommonFields, LoanFields } from "@/constants/fieldsName";

export const createCustomerLoanSchema = Yup.object().shape({
  [CommonFields.CUSTOMER_ID]: Yup.string().required("Customer is required"),

  [LoanFields.PRINCIPAL_AMOUNT]: Yup.number()
    .typeError("Pay Amount must be a number")
    .positive("Pay Amount must be greater than 0")
    .required("Pay Amount is required"),

  [LoanFields.TOTAL_PAY_AMOUNT]: Yup.number()
    .typeError("Loan Amount must be a number")
    .positive("Loan Amount must be greater than 0")
    .required("Loan Amount is required"),

  [LoanFields.MONTHS]: Yup.number()
    .typeError("No. of Installments must be a number")
    .integer("No. of Installments must be an integer")
    .positive("No. of Installments must be greater than 0")
    .required("No. of Installments is required"),

  [LoanFields.EMI_AMOUNT]: Yup.number()
    .typeError("EMI must be a number")
    .positive("EMI must be greater than 0")
    .required("EMI is required"),

  [LoanFields.INTREST_RATE]: Yup.number()
    .typeError("Interest Rate must be a number")
    .min(0, "Interest Rate cannot be negative")
    .required("Interest Rate is required"),

  [LoanFields.PAY_INSTALLMENT_DATE]: Yup.date()
    .typeError("Pay Installment Date must be a valid date")
    .required("Pay Installment Date is required"),

  [LoanFields.START_DATE]: Yup.date()
    .typeError("Start Date must be a valid date")
    .required("Start Date is required"),

  [LoanFields.END_DATE]: Yup.date()
    .typeError("End Date must be a valid date")
    .min(Yup.ref(LoanFields.START_DATE), "End Date cannot be before Start Date")
    .required("End Date is required"),

  [CommonFields.DESCRIPTION]: Yup.string().max(
    500,
    "Description cannot exceed 500 characters"
  ),

  [CommonFields.STATUS]: Yup.string().required("Status is required"),
});
