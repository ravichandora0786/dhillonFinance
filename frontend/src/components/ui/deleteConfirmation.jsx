import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/DeleteForeverOutlined";
import LoadingButton from "./loadingButton";

const DeleteConfirmationModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [resolve, setResolve] = useState(null);

  // Function to open the modal and return a promise
  const confirm = () => {
    setIsOpen(true);
    return new Promise((resolve) => {
      setResolve(() => resolve);
    });
  };

  // Function to handle confirmation result (true or false)
  const handleConfirm = (result) => {
    setIsOpen(false);
    resolve(result);
  };

  // Modal content
  const ModalContent = isOpen && (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray/70 bg-opacity-70"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        {/* Header */}

        {/* Body */}
        <div className="flex flex-col justify-between items-center text-center py-6 px-8">
          <DeleteIcon className="text-danger" sx={{ fontSize: 80 }} />
          <span className="text-2xl font-bold text-black">Confirm Delete</span>
          <p>
            You want to delete all the marked items, this cant be undone once
            you delete.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-center gap-3 px-6 pb-4">
          <div>
            <LoadingButton
              type="button"
              isLoading={false}
              disabled={false}
              variant={"secondary"}
              onClick={() => handleConfirm(false)}
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
              Yes, Delete
            </LoadingButton>
          </div>
        </div>
      </div>
    </div>
  );

  return { confirm, ModalContent };
};

export default DeleteConfirmationModal;
