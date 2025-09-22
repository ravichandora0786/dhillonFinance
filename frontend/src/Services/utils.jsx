/**
 * Utils
 * @format
 */

import moment from "moment";

export const removeTimeFromDate = (dateTime) => {
  if (!dateTime) return;
  return moment(dateTime).format("DD MMM YYYY");
};

export const convertTime24hTo12h = (time) => {
  if (!time) return;
  return moment(time, "HH:mm:ss").format("hh:mm A");
};

export const formatDDMMYYYYDate = (dateTime) => {
  if (!dateTime) return "";
  return moment(dateTime, ["YYYY-MM-DD", "YYYY-MM-DD HH:mm:ss", "x"]).format(
    "DD/MM/YYYY"
  );
};

export const getOnlyTodayDate = () => {
  return moment().format("YYYY-MM-DD");
};

export const getTimeFromDate = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const getDayNameFromDate = (dateTime) => {
  if (!dateTime) return;
  return moment(dateTime).format("dddd");
};

export const getFilterKey = (key) => {
  if (!key || typeof key !== "string") return key;

  switch (key.toLowerCase()) {
    case "phone number":
      return "phone";
    case "start date":
      return "startDate";
    case "int":
    case "ext":
    case "carp":
    case "pw":
    case "work":
    case "expense type":
      return "type";
    case "finished yes":
    case "finished no":
      return "finished";
    case "touch up yes":
    case "touch up no":
      return "touchUp";
    case "job title":
      return "jobTitle";
    case "bill to":
      return "billTo";
    case "client address":
      return "clientAddress";
    case "email campaign overview":
      return "email";
    case "text campaign overview":
      return "text";
    default:
      return key;
  }
};

/**
 * Truncates a string to a specified maximum length and appends an ellipsis ("...") if the string exceeds that length.
 *
 * @param {string} text - The string to be truncated.
 * @param {number} maxLength - The maximum allowed length of the string.
 * @returns {string} - The truncated string with an ellipsis appended if it exceeds the maximum length.
 */

export function ellipsify(text, maxLength) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
}

export const handleSetFieldValue = (value, setFieldValue, fieldName) => {
  setFieldValue(fieldName, value || null);
};

export const getYearFromDate = (date) => {
  if (!date) return "";
  return moment(date).format("YYYY");
};

export const formatUSPhoneNumber = (value) => {
  if (!value) return "";

  const cleaned = value.replace(/\D/g, "");

  if (cleaned.length < value.replace(/\D/g, "").length) return value;

  if (cleaned.length <= 3) {
    return `(${cleaned}`;
  } else if (cleaned.length <= 6) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
  } else {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)} ${cleaned.slice(
      6,
      10
    )}`;
  }
};

/**
 * Formats the input time value as the user types.
 *
 * @param {Event} e - The input event.
 * @returns {Event} - The event with the formatted value.
 *
 * Format: HH:MM
 */
export const formatTimeInput = (e) => {
  let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
  if (value.length > 2) {
    value = value.slice(0, 2) + ":" + value.slice(2, 4);
  }
  e.target.value = value;
  return e;
};

// extract view permissions from redux state
export const getViewPermissionsFromState = (permissionsState = []) => {
  const viewPermissions = new Set();

  permissionsState.forEach((p) => {
    if (
      p.permissionNames?.some((perm) => perm.toUpperCase().includes("VIEW"))
    ) {
      viewPermissions.add(p.activity.name.toLowerCase());
    }
  });

  return viewPermissions;
};

// filter menuData based on permissions
export const getFilteredMenuData = (menuData, permissionsState = []) => {
  const viewPermissions = getViewPermissionsFromState(permissionsState);

  return menuData
    .map((menu) => {
      if (menu.children && Array.isArray(menu.children)) {
        const filteredChildren = menu.children.filter((child) =>
          viewPermissions.has(child.label.toLowerCase().replace(/\s+/g, "_"))
        );

        return filteredChildren.length > 0
          ? { ...menu, children: filteredChildren }
          : null;
      }

      // single menu item
      return viewPermissions.has(menu.label.toLowerCase()) ? menu : null;
    })
    .filter(Boolean);
};

// parse Full Date into year month day format
export function parseFullDate(date) {
  if (!date) return null;

  // Agar string hai (YYYY-MM-DD format)
  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [year, month, day] = date.split("-");
    return `${year}-${month}-${day}`; // already correct format
  }

  // Agar Date object hai
  if (date instanceof Date && !isNaN(date)) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  return null;
}

export function todayDate() {
  const today = new Date();
  return today;
}
