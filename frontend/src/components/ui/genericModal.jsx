export default function GenericModal({
  showModal = false,
  closeModal = () => {},
  modalTitle = "",
  modalBody,
}) {
  return (
    <>
      {showModal && (
        <div className="fixed inset-0 w-full h-full z-50 flex items-center justify-center bg-gray-800/70">
          {/* Modal Box */}
          <div className="relative w-full max-w-2xl max-sm:max-w-[90vw] max-md:max-w-[90vw] max-h-[90vh] max-sm:max-h-[70vh] max-md:max-h-[70vh] flex flex-col bg-white rounded-lg shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-semibold text-xl text-black">
                {modalTitle}
              </span>
              <button
                onClick={() => closeModal()}
                className="text-gray-500 hover:text-red-500 text-2xl font-bold"
                aria-label="Close Modal"
              >
                &times;
              </button>
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
