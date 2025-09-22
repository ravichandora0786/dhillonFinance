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
  const rolePermissions = useSelector(selectRolePermissionsMap); // [{ route: "/role", permissionKey: "VIEW_ROLE" }, ...]

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

    // If path is protected but not in allowed routes → block
    const allProtected = Object.values(ProtectedRoutes);
    const isProtected = allProtected.includes(path);

    if (isProtected && !allowedRoutes.includes(path)) {
      setAuthorized(false);
      router.push("/404");
      return;
    }

    // Authorized
    setAuthorized(true);
  }

  return authorized ? <>{children}</> : null;
}
