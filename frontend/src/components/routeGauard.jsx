"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import {
  selectAccessToken,
  selectRolePermissionsMap,
} from "@/app/common/selectors";
import { AuthRoutes, ProtectedRoutes } from "@/Services/routes";

export default function RouteGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useSelector(selectAccessToken);
  const rolePermissions = useSelector(selectRolePermissionsMap);

  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    authCheck(pathname);
  }, [pathname, token, rolePermissions]);

  function authCheck(path) {
    const publicPaths = Object.values(AuthRoutes);
    const isPublic = publicPaths.includes(path);

    // Login check
    if (!token && !isPublic) {
      setAuthorized(false);
      router.push(AuthRoutes.LoginScreen);
      return;
    } else if (token && isPublic) {
      setAuthorized(false);
      router.push(ProtectedRoutes.DASHBOARD);
      return;
    }

    // Allowed routes from permissions
    const allowedRoutes = rolePermissions
      .map((p) => ProtectedRoutes[p.activity?.name?.toUpperCase()])
      .filter(Boolean);

    // All protected routes
    const allProtected = Object.values(ProtectedRoutes);
    const isProtected = allProtected.some((r) => path.startsWith(r));

    // If protected but not in allowed → block
    if (isProtected) {
      const hasPermission = allowedRoutes.some((route) =>
        path.startsWith(route)
      );
      if (!hasPermission) {
        setAuthorized(false);
        router.push("/404");
        return;
      }
    }

    // Handle completely invalid routes
    const isValidRoute =
      allProtected.some((r) => path.startsWith(r)) || isPublic;
    if (!isValidRoute) {
      setAuthorized(false);
      router.push(AuthRoutes.LoginScreen);
      return;
    }

    // ✅ Authorized
    setAuthorized(true);
  }

  return authorized ? <>{children}</> : null;
}
