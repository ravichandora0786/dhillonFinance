/** sidebar componenet */
"use client";
import {
  Sidebar as ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  useProSidebar,
} from "react-pro-sidebar";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
// Icons import ek hi line me
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Computer as RoomIcon,
  MenuBook as SubjectIcon,
  ViewAgenda as SectionIcon,
  Grade as GradeIcon,
  Extension as ModuleIcon,
  Assignment as ExamIcon,
  AssignmentTurnedIn as HomeworkIcon,
  Lock as PermissionsIcon,
  Home as HomeIcon,
  Menu as MenuIcon,
  ChevronLeft,
  CloseOutlined as CloseOutlinedIcon,
} from "@mui/icons-material";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { FaHandHoldingUsd } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import IconButton from "@/components/buttons/IconButton";
import { getFilteredMenuData } from "@/Services/utils";
import { selectRolePermissionsMap, selectUser } from "@/app/common/selectors";
import { useDispatch, useSelector } from "react-redux";
import useSocket from "@/hooks/useSocket";
import { getPermissionsByRoleId } from "@/app/common/slice";
import { ProtectedRoutes } from "@/Services/routes";

//  Menu Data Array
const menuData = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <DashboardIcon />,
    link: ProtectedRoutes.DASHBOARD,
  },
  {
    id: "customers",
    label: "Customer",
    icon: <PeopleIcon />,
    link: ProtectedRoutes.CUSTOMER,
  },

  {
    id: "loans",
    label: "Loan",
    icon: <FaHandHoldingUsd size={22} />,
    link: ProtectedRoutes.LOAN,
  },
  // {
  //   id: "transactions",
  //   label: "Transaction",
  //   icon: <GrTransaction size={22} />,
  //   link: ProtectedRoutes.TRANSATION,
  // },
  // {
  //   id: "invoices",
  //   label: "Invoice",
  //   icon: <FaFileInvoiceDollar size={22} />,
  //   link: ProtectedRoutes.INVOICE,
  // },
  // {
  //   id: "permissions",
  //   label: "Permission",
  //   icon: <PermissionsIcon />,
  //   link: ProtectedRoutes.PERMISSIONS,
  // },
];

const Sidebar = ({ isMobile = false, mobileViewToggle = () => {} }) => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { socket } = useSocket();
  const { collapsed, collapseSidebar } = useProSidebar();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [open, setOpen] = useState("");
  const permissionsState = useSelector(selectRolePermissionsMap) || [];
  const userDetail = useSelector(selectUser) || {};

  const filteredMenu = getFilteredMenuData(menuData, permissionsState);
  console.log(permissionsState, "filteredMenu");

  const handleOpenSubMenu = (key) => {
    setOpen(open === key ? "" : key);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    collapseSidebar(!isCollapsed);
  };

  const getPermissionsListByRoleId = (roleId) => {
    dispatch(
      getPermissionsByRoleId({
        id: roleId,
        onSuccess: ({ data }) => {},
        onFailure: ({ message }) => {},
      })
    );
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("activityPermissionUpdated", (data) => {
      // if (userDetail) {
      getPermissionsListByRoleId(userDetail?.roleId);
      // }
    });

    return () => {
      socket.off("activityPermissionUpdated");
    };
  }, [socket, userDetail]);

  return (
    <div className="sticky top-0 z-10 flex h-screen min-h-60">
      <ProSidebar
        defaultCollapsed={isCollapsed}
        backgroundColor="var(--color-sidebar-bg)"
        collapsedWidth="50px"
      >
        <Menu
          menuItemStyles={{
            icon: ({ active, disabled }) => ({
              marginLeft: "0px",
              marginRight: collapsed ? "0px" : "0px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }),
            button: ({ level, active }) => {
              const commonStyles = {
                width: "90%",
                margin: collapsed ? "0px 0px 0px 3px" : "0px auto",
                display: "flex",
                borderRadius: "10px",
                color: "var(--color-sidebar-text)",
                justifyContent: collapsed ? "center" : "flex-start",
                padding: collapsed ? "8px" : "10px 16px",
                // height: "34px",
              };
              const activeStyles = {
                backgroundColor: "var(--color-active-bg)",
                color: "var(--color-active-text)",
              };
              const hoverStyles = {
                "&:hover": {
                  backgroundColor: "var(--color-sidebar-button-hover)",
                },
              };

              return {
                ...commonStyles,
                ...(active && activeStyles),
                ...hoverStyles,
              };
            },
            subMenuContent: () => ({
              backgroundColor: "var(--color-sidebar-bg)",
              color: "var(--color-sidebar-text)",
              marginTop: "5px",
            }),
          }}
        >
          {/* Logo / Avatar */}
          <div className="flex items-center justify-content-center text-cente">
            {collapsed ? (
              <MenuItem
                icon={
                  collapsed ? (
                    <MenuIcon sx={{ color: "var(--color-sidebar-text)" }} />
                  ) : undefined
                }
                onClick={() => collapsed && toggleSidebar()}
              ></MenuItem>
            ) : (
              <div className="flex flex-row px-4 py-2 items-center justify-between w-full">
                <h5 className=" font-semibold text-sidebar-text">Finance</h5>
                {/* {isMobile ? (
                  <IconButton
                    icon={
                      <CloseOutlinedIcon
                        sx={{ color: "var(--color-sidebar-text)" }}
                      />
                    }
                    onClick={mobileViewToggle}
                  />
                ) : (
                  <IconButton
                    icon={
                      <ChevronLeft
                        sx={{ color: "var(--color-sidebar-text)" }}
                      />
                    }
                    onClick={toggleSidebar}
                  />
                )} */}
                <IconButton
                  icon={
                    <CloseOutlinedIcon
                      sx={{ color: "var(--color-sidebar-text)" }}
                    />
                  }
                  onClick={mobileViewToggle}
                />
              </div>
            )}
          </div>
          {/* Render Menu via Array */}
          {filteredMenu?.map((menu) =>
            menu.children ? (
              <SubMenu
                key={menu.id}
                label={!collapsed ? menu.label : ""}
                icon={menu.icon}
                active={
                  pathname === menu.link || pathname.startsWith(menu.link + "/")
                }
                // active={
                //   (open !== menu.id && pathname?.startsWith("/" + menu.id)) ||
                //   (open === menu.id && pathname?.startsWith("/" + menu.id))
                // }
                onClick={() => handleOpenSubMenu(menu.id)}
                open={open === menu.id}
              >
                {menu.children.map((child) => (
                  <MenuItem
                    key={child.id}
                    active={
                      pathname === child.link ||
                      pathname.startsWith(child.link + "/")
                    }
                    component={<Link href={child.link} />}
                  >
                    {child.label}
                  </MenuItem>
                ))}
              </SubMenu>
            ) : (
              <MenuItem
                key={menu.id}
                icon={menu.icon}
                // active={pathname.startsWith(menu.link)}
                active={
                  pathname === menu.link || pathname.startsWith(menu.link + "/")
                }
                component={<Link href={menu.link} />}
                onClick={mobileViewToggle}
              >
                {!collapsed && menu.label}
              </MenuItem>
            )
          )}
        </Menu>
      </ProSidebar>
    </div>
  );
};

export default Sidebar;
