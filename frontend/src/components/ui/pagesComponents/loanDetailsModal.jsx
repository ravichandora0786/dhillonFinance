"use client";
import React from "react";
import GenericModal from "@/components/ui/genericModal";
import LoanTransactionTable from "@/components/ui/loanTransactionTable";
import ViewField from "../viewField";

const LoanDetailModal = ({
  openModal,
  onBack = () => {},
  data,
  callBackFunc,
}) => {
  const loan = data;

  return (
    <GenericModal
      showModal={openModal}
      closeModal={onBack}
      modalTitle={"Loan Details"}
      modalBody={
        <div className="max-w-4xl mx-auto h-full">
          {/* Header Section */}
          <div className="">
            <h3 className="text-lg font-semibold text-slate-700 mb-3">
              Customer Details
            </h3>

            <div className="p-4 mb-4 rounded-lg border border-slate-200 bg-white shadow-sm">
              {/* Basic Customer Info */}
              <div className="grid grid-cols-2 md:grid-cols-2 sm:grid-cols-2 gap-4">
                <ViewField
                  label="Customer Name"
                  value={`${loan?.customer?.firstName} ${loan?.customer?.lastName} s/o ${loan?.customer?.fatherName}`}
                />
                <ViewField
                  label="Mobile Number"
                  value={`${loan?.customer?.mobileNumber}`}
                />
                <ViewField
                  label="Address"
                  value={`${loan?.customer?.address}, ${loan?.customer?.city}`}
                />
                <ViewField label="Status" value={loan?.customer?.status} />
              </div>
            </div>
          </div>

          {/* Loan Details Section */}
          {Object.keys(loan).length > 0 ? (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-slate-700 mb-3">
                Loan Details
              </h3>

              <div className="p-4 mb-4 rounded-lg border border-slate-200 bg-white shadow-sm">
                {/* loan Number */}
                <div className="flex flex-row justify-start items-center gap-4 mb-2">
                  <span className="text-lg">{`Loan No. :`}</span>
                  <span className="text-lg underline">{loan?.loanNumber}</span>
                </div>
                {/* Basic Loan Info */}
                <div className="grid grid-cols-2 md:grid-cols-2 sm:grid-cols-2 gap-4">
                  <ViewField label="Loan Amount" value={`₹ ${loan?.amount}`} />
                  <ViewField
                    label="Interest Rate"
                    value={`${loan?.interestRate}%`}
                  />
                  <ViewField label="EMIs (Months)" value={loan?.tenureMonths} />
                  <ViewField
                    label="EMI Amount"
                    value={`₹ ${loan?.emiAmount}`}
                  />
                  <ViewField
                    label="Total Payable"
                    value={`₹ ${loan?.totalPayableAmount}`}
                  />
                  <ViewField label="Status" value={loan?.status} />
                  <ViewField label="Start Date" value={loan?.startDate} />
                  <ViewField label="End Date" value={loan?.endDate} />
                  <ViewField
                    label="Next Installment Date"
                    value={loan?.installmentDate}
                  />
                  <ViewField
                    label="Next EMI Amount"
                    value={`₹ ${loan?.nextEmiAmount}`}
                  />
                  <ViewField label="Paid EMIs" value={loan?.paidEmis} />
                  <ViewField label="Pending EMIs" value={loan?.pendingEmis} />
                  <ViewField
                    label="Total Received Payments"
                    value={`₹ ${loan?.paymentsReceived}`}
                  />
                  <ViewField
                    label="Pending Payments"
                    value={`₹ ${loan?.pendingAmount}`}
                  />
                  <ViewField
                    label="Total charges"
                    value={`₹ ${loan?.totalLateCharges}`}
                  />
                  <ViewField
                    label="Profit Amount"
                    value={`₹ ${loan?.profitAmount}`}
                  />
                  <ViewField
                    label="Loss Amount"
                    value={`₹ ${loan?.lossAmount}`}
                  />
                </div>

                {/* Description */}
                {loan?.description && (
                  <div className="mt-3">
                    <ViewField label="Description" value={loan?.description} />
                  </div>
                )}

                {/* Transactions */}
                {loan?.transactions?.length > 0 && (
                  <LoanTransactionTable
                    transactions={loan.transactions}
                    callBackFunc={() => {
                      onBack();
                      callBackFunc();
                    }}
                    loanData={loan}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-sm text-slate-500 mt-6">
              No loans found.
            </div>
          )}
        </div>
      }
    />
  );
};

export default LoanDetailModal;
