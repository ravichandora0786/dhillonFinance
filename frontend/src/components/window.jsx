"use client";
import { useState, useEffect } from "react";
import { Box } from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import ToastContainer from "@/components/toastContainer";
import Sidebar from "@/components/sidebar/sidebar";
import RouteGuard from "@/components/routeGauard";
import { usePathname, useRouter } from "next/navigation";
import { ProSidebarProvider } from "react-pro-sidebar";
import { selectAccessToken } from "@/app/common/selectors";
import { AuthRoutes } from "@/Services/routes";

export default function App({ children }) {
  const [loading, setLoading] = useState(false);
  const token = useSelector(selectAccessToken);
  const router = useRouter();
  const pathname = usePathname();
  const hideSidebar = pathname === AuthRoutes.LoginScreen;

  return (
    <ProSidebarProvider>
      <Box sx={{ display: "flex" }}>
        {!hideSidebar && <Sidebar />}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 0,
            transition: "margin-left 0.3s ease",
            minHeight: "100vh",
            bgcolor: "#FFFFFF",
          }}
        >
          <RouteGuard>
            {children}
            <ToastContainer />
          </RouteGuard>
        </Box>
      </Box>
    </ProSidebarProvider>
  );
}
