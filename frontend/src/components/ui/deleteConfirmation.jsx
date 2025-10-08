import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/DeleteForeverOutlined";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import LoadingButton from "./loadingButton";

const ConfirmationModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [resolve, setResolve] = useState(null);
  const [modalData, setModalData] = useState({});

  const confirm = (options) => {
    setModalData({
      title: options?.title,
      message:
        options?.message ||
        "Are you sure you want to perform this action? This cannot be undone.",
      details: options?.details || [],
      confirmText: options?.confirmText || "Yes",
      cancelText: options?.cancelText || "No",
      icon: options?.icon || "info",
      loading: options?.loading || false,
    });
    setIsOpen(true);

    return new Promise((resolveFn) => {
      setResolve(() => resolveFn);
    });
  };

  const handleConfirm = (result) => {
    setIsOpen(false);
    if (resolve) resolve(result);
  };

  const ModalContent = isOpen && (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray/70 bg-opacity-70"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col justify-between items-center text-center py-6 px-8">
          {modalData.icon === "delete" ? (
            <DeleteIcon className="text-danger" sx={{ fontSize: 70 }} />
          ) : (
            <InfoIcon className="text-danger" sx={{ fontSize: 70 }} />
          )}
          <h2 className="text-2xl font-bold text-gray-800 mt-2">
            {modalData.title}
          </h2>
          <p className="text-gray-600 mt-2">{modalData.message}</p>
        </div>

        {/* Dynamic Loan Details */}
        {modalData.details && modalData.details.length > 0 && (
          <div className="px-8 pb-4">
            <div className="border rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
              {modalData.details.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between border-b last:border-none py-1"
                >
                  <span className="font-medium">{item.label}</span>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex justify-center gap-3 px-6 pb-4">
          <div>
            <LoadingButton
              type="button"
              isLoading={false}
              disabled={false}
              variant={"secondary"}
              onClick={() => handleConfirm(false)}
            >
              {modalData.cancelText}
            </LoadingButton>
          </div>
          <div>
            <LoadingButton
              type="button"
              isLoading={modalData.loading}
              variant={modalData.icon === "delete" ? "danger" : "primary"}
              onClick={() => handleConfirm(true)}
            >
              {modalData.confirmText}
            </LoadingButton>
          </div>
        </div>
      </div>
    </div>
  );

  return { confirm, ModalContent };
};

export default ConfirmationModal;
