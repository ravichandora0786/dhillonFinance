import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { ImPencil } from "react-icons/im";
import { getUploadedFile, imageUpload } from "@/app/common/slice";
import GenericModal from "./genericModal";
import { updateUser } from "@/app/user/slice";
import LoadingButton from "./loadingButton";
import InputBox from "./inputBox";

export const UserProfileUploadImage = ({
  fileId,
  userId,
  fieldName,
  callBackFunc,
}) => {
  const dispatch = useDispatch();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);

  // Fetch image by fileId (backend se image lane ke liye)
  const updateFileField = async (fileId) => {
    if (!fileId) return;
    dispatch(
      getUploadedFile({
        id: fileId,
        onSuccess: ({ data }) => {
          if (data?.url) {
            setUploadedImage(data.url);
          }
        },
        onFailure: () => {
          console.error(`Failed to fetch`);
        },
      })
    );
  };

  useEffect(() => {
    if (fileId) {
      updateFileField(fileId);
    }
  }, [fileId]);

  // Jab user confirm kare upload
  const handleSubmitData = async () => {
    setButtonLoading(true);

    if (selectedFile) {
      await dispatch(
        imageUpload({
          file: selectedFile,
          onSuccess: (response) => {
            const { message, data } = response;
            if (data) {
              dispatch(
                updateUser({
                  id: userId,
                  data: { [fieldName]: data.id },
                  onSuccess: ({ message, data: userData }) => {
                    console.log(message);
                    console.log(userData, "userData");
                    // setUploadedImage(data.url);
                    updateFileField(userData[fieldName]);
                    setOpenModal(false);
                    setButtonLoading(false);
                    toast.success("Profile image updated successfully");
                  },
                  onFailure: () => {
                    setButtonLoading(false);
                    toast.error("User Update Fail");
                  },
                })
              );
            }
          },
          onFailure: () => {
            setButtonLoading(false);
            toast.error("Upload File Fail");
          },
        })
      );
    } else {
      setButtonLoading(false);
      toast.error("Please select an image");
    }
  };

  return (
    <div>
      <div className="relative w-26 h-26">
        {/* Profile Image */}
        <img
          src={uploadedImage || "https://via.placeholder.com/150?text=Profile"}
          alt="Profile"
          className="w-full h-full object-cover rounded-xl shadow"
        />

        {/* Pencil Button */}
        <button
          type="button"
          onClick={() => {
            setSelectedFile(null);
            setOpenModal(true);
          }}
          className="absolute -bottom-2 -right-2 bg-white shadow rounded-full p-2 cursor-pointer hover:bg-gray-100"
        >
          <ImPencil size={18} className="text-gray-700" />
        </button>
      </div>

      <>
        <GenericModal
          showModal={openModal}
          closeModal={() => {
            setSelectedFile(null);
            setOpenModal(false);
          }}
          modalTitle={"Update Profile Photo"}
          modalBody={
            <div>
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
                {/* Preview */}
                {selectedFile ? (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-xl mx-auto mb-4"
                  />
                ) : (
                  <div className="w-32 h-32 mx-auto flex items-center justify-center bg-gray-100 rounded-xl mb-4">
                    <span className="text-gray-500 text-sm">No image</span>
                  </div>
                )}

                {/* File Input */}
                <InputBox
                  accept="image/jpeg,image/png,image/webp"
                  name={fieldName}
                  type="file"
                  id={fieldName}
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <div>
                  <LoadingButton
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setSelectedFile(null);
                      setOpenModal(false);
                    }}
                  >
                    Cancel
                  </LoadingButton>
                </div>
                <div>
                  <LoadingButton
                    type="submit"
                    isLoading={buttonLoading}
                    disabled={buttonLoading}
                    onClick={() => {
                      handleSubmitData();
                    }}
                  >
                    Upload
                  </LoadingButton>
                </div>
              </div>
            </div>
          }
        />
      </>
    </div>
  );
};
