"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import LoadingButton from "./loadingButton";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { logoutApp } from "@/app/common/slice";
import { AuthRoutes } from "@/Services/routes";
import { FiLogOut } from "react-icons/fi";

const LogoutConfirmation = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleConfirm = (result) => {
    dispatch(logoutApp());
    router.push(AuthRoutes.LoginScreen);
    setShowModal(false);
  };

  return (
    <>
      {/* Logout Button */}
      <LoadingButton
        type="button"
        isLoading={false}
        disabled={false}
        variant={"custom"}
        className="px-0 py-2"
        onClick={() => openModal()}
      >
        <FiLogOut size={16} className="text-danger" />
      </LoadingButton>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray/70 bg-opacity-70"
          aria-modal="true"
        >
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
            {/* Header */}

            {/* Body */}
            <div className="flex flex-col justify-between items-center text-center py-6 px-8">
              <LogoutOutlinedIcon
                className="text-danger"
                sx={{ fontSize: 80 }}
              />
              <span className="text-2xl font-bold text-black">LogOut</span>
              <p>Are you sure you want to logout?</p>
            </div>

            {/* Footer */}
            <div className="flex justify-center gap-3 px-6 pb-4">
              <div>
                <LoadingButton
                  type="button"
                  isLoading={false}
                  disabled={false}
                  variant={"secondary"}
                  onClick={() => closeModal()}
                >
                  Cancel
                </LoadingButton>
              </div>
              <div>
                <LoadingButton
                  type="button"
                  isLoading={false}
                  disabled={false}
                  variant={"danger"}
                  onClick={() => handleConfirm(true)}
                >
                  LogOut
                </LoadingButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogoutConfirmation;
