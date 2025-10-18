/**
 * Download PDF Component
 */

import { getPdfHTMLByID } from "@/app/common/slice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import html2pdf from "html2pdf.js";
import GenericModal from "../genericModal";
import FullScreenLoader from "@/components/ui/fullScreenLoader"; // import your loader

const PrintPdf = ({
  openModal,
  onBack = () => {},
  customerId,
  loanId,
  customerData,
}) => {
  const dispatch = useDispatch();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");

  const getPdfHTML = async (customerId, loanId) => {
    setButtonLoading(true);
    await new Promise((resolve, reject) => {
      dispatch(
        getPdfHTMLByID({
          customerId,
          loanId,
          onSuccess: ({ data }) => {
            setHtmlContent(data);
            resolve();
            setButtonLoading(false);
          },
          onFailure: (error) => {
            console.error(error);
            reject(new Error(error));
            setButtonLoading(false);
          },
        })
      );
    });
  };

  useEffect(() => {
    if (customerId || loanId) {
      getPdfHTML(customerId, loanId);
    }
  }, [customerId, loanId]);

  const openPrintScreen = () => {
    const element = document.getElementById("hidden-html-container");
    const printWindow = window.open("", "_blank", "width=800,height=600");

    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`${element.innerHTML}`);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    } else {
      console.error("Failed to open print window. Please allow popups.");
    }
  };

  const downloadPDF = () => {
    const element = document.getElementById("hidden-html-container");

    const options = {
      margin: [0, 5, 5, 5],
      filename: `${customerData.firstName}_${customerData.lastName}.pdf`,
      html2canvas: {
        scale: 2,
        scrollX: 0,
        scrollY: 0,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
    };

    setButtonLoading(true);
    html2pdf()
      .set(options)
      .from(element)
      .save()
      .finally(() => setButtonLoading(false));
  };

  return (
    <GenericModal
      showModal={openModal}
      closeModal={onBack}
      modalTitle={"Download / Print PDF"}
      modalBody={
        <>
          <div className="max-w-full mx-auto p-4 space-y-4">
            {/* Action buttons */}
            <div className="flex gap-4 mb-4">
              <button
                onClick={downloadPDF}
                disabled={buttonLoading || !htmlContent}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {buttonLoading ? "Loading..." : "Download PDF"}
              </button>
              <button
                onClick={openPrintScreen}
                disabled={buttonLoading || !htmlContent}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Print
              </button>
            </div>

            {/* Hidden printable content */}
            <div id="hidden-html-container" className="py-4">
              <div dangerouslySetInnerHTML={{ __html: htmlContent }}></div>
            </div>
          </div>
          {/* Full screen loader */}
          <FullScreenLoader
            showLoader={buttonLoading}
            message="Please Wait..."
          />
        </>
      }
    />
  );
};

export default PrintPdf;
