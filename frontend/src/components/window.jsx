"use client";
import { useState, useEffect } from "react";
import { Box, IconButton, Drawer, AppBar, Toolbar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useDispatch, useSelector } from "react-redux";
import ToastContainer from "@/components/toastContainer";
import Sidebar from "@/components/sidebar/sidebar";
import RouteGuard from "@/components/routeGauard";
import { usePathname, useRouter } from "next/navigation";
import { ProSidebarProvider } from "react-pro-sidebar";
import { selectAccessToken } from "@/app/common/selectors";
import { AuthRoutes } from "@/Services/routes";
import Header from "./header/header";

export default function App({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [menu, setMenu] = useState(true);

  const token = useSelector(selectAccessToken);
  const router = useRouter();
  const pathname = usePathname();

  const hideSidebar = pathname === AuthRoutes.LoginScreen;

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // less than 768px considered mobile
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
    setMenu(!menu);
  };

  return (
    <ProSidebarProvider>
      <Box sx={{ display: "flex" }}>
        {/* {!hideSidebar && !isMobile && <Sidebar />} */}
        {/* 
        {isMobile && !hideSidebar && (
          <AppBar position="fixed" sx={{ background: "var(--color-primary)" }}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
              >
                <MenuIcon sx={{ color: "#fff" }} />
              </IconButton>
            </Toolbar>
          </AppBar>
        )} */}

        {!hideSidebar && (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            BackdropProps={{
              style: {
                backgroundColor: "transparent",
              },
            }}
            sx={{
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                backgroundColor: "white",
                boxShadow: "none",
              },
            }}
          >
            <Sidebar
              isMobile={isMobile}
              mobileViewToggle={handleDrawerToggle}
            />
          </Drawer>
        )}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            direction: "column",
            p: 0,
            transition: "margin-left 0.3s ease",
            minHeight: "100vh",
            bgcolor: "#FFFFFF",
            maxWidth: "100%",
            // mt: isMobile && !hideSidebar ? 8 : 0,
          }}
        >
          {!hideSidebar && (
            <Header
              handleDrawerToggle={handleDrawerToggle}
              isMobile={isMobile}
              menu={menu}
            />
          )}

          <RouteGuard>
            <div className="mt-8">{children}</div>
            <ToastContainer />
          </RouteGuard>
        </Box>
      </Box>
    </ProSidebarProvider>
  );
}
