"use client";
import React, { useState } from "react";
import { FiMenu, FiUser, FiSettings } from "react-icons/fi";
import { TfiHome } from "react-icons/tfi";
import { RiMenu3Fill } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { selectAccessToken, selectUser } from "@/app/common/selectors";
import LogoutConfirmation from "@/components/ui/logoutConfirmation";
import LoadingButton from "../ui/loadingButton";
import { ProtectedRoutes } from "@/Services/routes";

export default function Header({ handleDrawerToggle, menu }) {
  const router = useRouter();
  const dispatch = useDispatch();

  // Redux user data
  const user = useSelector(selectUser);
  const token = useSelector(selectAccessToken);

  return (
    <header className="w-full z-50 fixed bg-primary/70 shadow px-4 py-1 flex justify-between items-center">
      {/* Left - Logo */}
      <div
        className="text-xl font-bold text-black cursor-pointer"
        onClick={() => router.push("/dashboard")}
      >
        MyFinanceApp
      </div>

      {/* Right - Profile Section */}
      <div className="relative flex items-center gap-2">
        {token && (
          <div className="">
            <LoadingButton
              type="button"
              isLoading={false}
              disabled={false}
              variant={"custom"}
              className="px-0 py-2"
              onClick={() => {
                handleDrawerToggle();
              }}
            >
              {menu ? (
                <FiMenu className="mr-2" />
              ) : (
                <RiMenu3Fill className="mr-2" />
              )}
            </LoadingButton>
          </div>
        )}

        <div className="">
          <LoadingButton
            type="button"
            isLoading={false}
            disabled={false}
            variant={"custom"}
            className="px-0 py-2"
            onClick={() => {
              router.push(`${ProtectedRoutes?.DASHBOARD}`);
            }}
          >
            <TfiHome className="" />
          </LoadingButton>
        </div>
        {token && (
          <>
            <div className="">
              <LoadingButton
                type="button"
                isLoading={false}
                disabled={false}
                variant={"custom"}
                className="px-0 py-2"
                onClick={() => {
                  router.push(`/user/profile/${user?.id}`);
                }}
              >
                <FiUser className="" />
              </LoadingButton>
            </div>
            <div className="">
              <LogoutConfirmation />
            </div>
          </>
        )}
        {/* <div className="">
          <LoadingButton
            type="button"
            isLoading={false}
            disabled={false}
            variant={"custom"}
            className="px-0 py-2"
            onClick={() => {
              router.push(`/user/profile/${user?.id}`);
            }}
          >
            <FiSettings className="" />
          </LoadingButton>
        </div> */}
      </div>
    </header>
  );
}
