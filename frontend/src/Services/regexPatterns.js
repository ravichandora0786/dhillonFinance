export const AADHAR_REGEX = "^[2-9][0-9]{11}$";
export const ALPHABETIC_REGEX = "^[a-zA-Z]+( [a-zA-Z]+)*$";
export const ALPHANUMERIC_REGEX = "^[a-zA-Z0-9]+$";
export const DATE_YYYY_MM_DD_REGEX = "^\\d{4}-\\d{2}-\\d{2}$";
export const DECIMAL_NUMBER_REGEX = "^\\d+(\\.\\d{1,4})?$";
export const EMAIL_BASIC_REGEX = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
export const ID_FORMAT_REGEX = "^[a-zA-Z0-9_-]{3,50}$";
export const IFSC_CODE_REGEX = "^[A-Z]{4}0[A-Z0-9]{6}$";
export const NUMERIC_REGEX = "^[0-9]+$";
export const PAN_CARD_REGEX = "^[A-Z]{5}[0-9]{4}[A-Z]$";
export const STRONG_PASSWORD_REGEX =
  "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-={}\\[\\]:;\"'<>.,.?\\/]).{8,}$";
export const PHONE_NUMBER_REGEX = "^\\+?[0-9]{10,15}$";
export const INDIAN_PINCODE_REGEX = "^[1-9][0-9]{5}$";
export const TIME_HH_MM_REGEX = "^([01]?[0-9]|2[0-3]):[0-5][0-9]$";
export const URL_REGEX =
  "^(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?$";
