export default function GenericModal({
  showModal = false,
  closeModal = () => {},
  modalTitle = "",
  modalBody,
}) {
  return (
    <>
      {showModal && (
        <div className="fixed inset-0 w-full h-full z-50 flex items-center justify-center bg-gray/70 bg-opacity-70">
          {/* Modal Box */}
          <div className="relative w-full max-w-2xl h-full flex flex-col justify-center items-center ">
            <div className="w-full  mx-auto bg-white rounded-lg">
              {/* Header */}
              <div className="w-full  mx-auto  flex items-center justify-between p-4 border-b">
                <span className="font-[600] text-2xl">{modalTitle}</span>
                <button
                  onClick={() => closeModal()}
                  className="text-gray-500 hover:text-danger text-2xl font-bold"
                  aria-label="Close Modal"
                >
                  &times;
                </button>
              </div>
              {/* Body */}
              <div className="w-full  mx-auto  p-4">{modalBody}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
