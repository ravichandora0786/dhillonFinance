/**
 * scroll and focus of first field
 * @format
 */
import { useFormikContext } from "formik";
import { useEffect } from "react";

const ScrollToError = () => {
  const { errors, isSubmitting } = useFormikContext();

  useEffect(() => {
    if (isSubmitting && Object.keys(errors).length > 0) {
      const firstErrorField = document.querySelector(
        `[name="${Object.keys(errors)[0]}"]`
      );
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
        firstErrorField.focus({ preventScroll: true });
      }
    }
  }, [errors, isSubmitting]);

  return null;
};

export default ScrollToError;
