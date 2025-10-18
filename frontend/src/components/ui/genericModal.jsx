import { IoCloseSharp } from "react-icons/io5";
import { TbFileDownload } from "react-icons/tb";

export default function GenericModal({
  showModal = false,
  closeModal = () => {},
  print = () => {},
  modalTitle = "",
  modalBody,
  name = "",
}) {
  return (
    <>
      {showModal && (
        <div className="fixed inset-0 w-full h-full z-50 flex items-center justify-center bg-gray-800/70">
          {/* Modal Box */}
          <div className="relative w-full max-w-6xl max-sm:max-w-[90vw] max-md:max-w-[90vw] max-h-[90vh] max-sm:max-h-[70vh] max-md:max-h-[70vh] flex flex-col bg-white rounded-lg shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-semibold text-xl text-black">
                {modalTitle}
              </span>
              <div className="flex flex-row justify-between gap-2 items-center">
                {name === "customerDetail" && (
                  <button
                    onClick={() => print()}
                    type="button"
                    className="text-gray-500 hover:text-green-500 text-2xl font-bold"
                    aria-label="Print"
                  >
                    <TbFileDownload size={20} />
                  </button>
                )}
                <button
                  onClick={() => closeModal()}
                  type="button"
                  className="text-gray-500 hover:text-red-500 text-2xl font-bold"
                  aria-label="Close Modal"
                >
                  <IoCloseSharp size={22} />
                </button>
              </div>
            </div>
            {/* Body */}
            <div className="flex-1 overflow-auto p-4 scrollbar-hide">
              {modalBody}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
