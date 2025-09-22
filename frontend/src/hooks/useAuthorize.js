// Custom hook
import { useSelector } from "react-redux";
import { useMemo, useCallback } from "react";

/**
 * A custom hook that provides authorization functionality.
 * It returns an object with the following properties:
 * - permissions: an array of strings representing the user's permissions
 * - rolesArray: an array of strings representing the user's roles
 * - hasPermission: a function that takes a permission string as an argument and returns a boolean indicating whether the user has that permission
 * - hasRole: a function that takes one or more role strings as arguments and returns a boolean indicating whether the user has any of those roles
 */
export const useAuthorize = () => {
  const {
    permissions = [],
    roles = [],
    modulePermissions = [],
  } = { permissions: [], roles: [], modulePermissions: [] };

  // Create an array of role names from the user object
  const rolesArray = roles?.map((role) => role?.name);

  /**
   * A function that takes a permission string as an argument and returns a boolean indicating whether the user has that permission
   * @param {string} requiredPermission - the permission to check
   * @returns {boolean} - true if the user has the permission, false otherwise
   */
  const hasPermission = useCallback(
    (requiredPermission) => {
      return permissions?.includes(requiredPermission);
    },
    [permissions]
  );

  /**
   * A function that takes one or more role strings as arguments and returns a boolean indicating whether the user has any of those roles
   * @param  {...string} requiredRoles - the roles to check
   * @returns {boolean} - true if the user has any of the roles, false otherwise
   */
  const hasRole = useCallback(
    (...requiredRoles) => {
      return requiredRoles?.some((role) => rolesArray?.includes(role));
    },
    [rolesArray]
  );

  /**
   * A function that takes one or more role strings as arguments and returns a boolean indicating whether the user has any of those roles
   * @param  {...string} requiredModules - the roles to check
   * @returns {boolean} - true if the user has any of the roles, false otherwise
   */
  const hasModulePermission = useCallback(
    (...requiredModules) => {
      return requiredModules?.some((module) =>
        modulePermissions?.includes(module)
      );
    },
    [modulePermissions]
  );

  // Return an object with the authorization properties
  return useMemo(
    () => ({
      permissions,
      rolesArray,
      hasPermission,
      hasRole,
      hasModulePermission,
    }),
    [
      permissions,
      rolesArray,
      modulePermissions,
      hasPermission,
      hasRole,
      hasModulePermission,
    ]
  );
};
