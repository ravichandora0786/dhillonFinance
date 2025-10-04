/**
 * All fields names Declare
 * @format
 */

export const UserFields = {
  EMAIL: "email",
  NAME: "userName",
  PASSWORD: "password",
  GENDER: "gender",
  DATE_OF_BIRTH: "dob",
  ADDRESS: "address",
  MOBILE_NUMBER: "mobileNumber",
  STATUS: "status",
  PROFILE_IMAGE: "profileImage",
  OLD_PASSWORD: "oldPassword",
  NEW_PASSWORD: "newPassword",
  CONFIRM_NEW_PASSWORD: "confirmPassword",
};

export const RoleFields = {
  ID: "id",
  NAME: "name",
  DESCRIPTION: "description",
  STATUS: "status",
};

export const ActivityMasterFields = {
  ID: "id",
  NAME: "name",
  STATUS: "status",
};

export const PermissionFields = {
  ID: "id",
  NAME: "name",
  STATUS: "status",
  DESCRIPTION: "description",
};

export const CustomerFields = {
  FIRST_NAME: "firstName",
  LAST_NAME: "lastName",
  MOBILE_NUMBER: "mobileNumber",
  PIN_CODE: "pinCode",
  ADDRESS: "address",
  CITY: "city",
  DISTRICT: "district",
  STATE: "state",
  AADHAR_NUMBER: "aadharNumber",
  PAN_CARD_NUMBER: "panCardNumber",
  AADHAR_IMAGE: "aadharImage",
  PAN_CARD_IMAGE: "panCardImage",
  AGREEMENT_IMAGE: "agreementImage",
  PROFILE_IMAGE: "profileImage",
  VEHICLE_NUMBER: "vehicleNumber",
  ANY_PRUF_IMAGE: "otherImage",
};

export const LoanFields = {
  PRINCIPAL_AMOUNT: "amount",
  INTREST_RATE: "interestRate",
  MONTHS: "tenureMonths",
  EMI_AMOUNT: "emiAmount",
  TOTAL_PAY_AMOUNT: "totalPayableAmount",
  START_DATE: "startDate",
  END_DATE: "endDate",
  PAY_INSTALLMENT_DATE: "installmentDate",
};

export const TransactionFields = {
  TRANSACTION_TYPE: "transactionType",
  AMOUNT: "amount",
  PAYMENT_MODE: "paymentMode",
  TRANSACTION_DATE: "transactionDate",
};

export const CommonFields = {
  ID: "id",
  CUSTOMER_ID: "customerId",
  STATUS: "status",
  ROLE_ID: "roleId",
  IS_ACTIVE: "isActive",
  DESCRIPTION: "description",
};
