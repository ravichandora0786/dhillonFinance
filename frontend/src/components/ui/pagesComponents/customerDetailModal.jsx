"use client";
import React from "react";
import GenericModal from "@/components/ui/genericModal";
import ViewField from "../viewField";

const CustomerDetailModal = ({ openModal, onBack = () => {}, data }) => {
  const customer = data;

  return (
    <GenericModal
      showModal={openModal}
      closeModal={onBack}
      modalTitle={"Customer Details"}
      modalBody={
        <div className="max-w-4xl mx-auto h-full">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 p-0 px-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {customer?.profileFile ? (
                  <iframe
                    src={customer?.profileFile?.image}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover shadow-md border"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary/7 flex items-center justify-center text-primary font-semibold text-3xl border">
                    {customer?.firstName?.[0]?.toUpperCase()}
                    {customer?.lastName?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-semibold text-slate-900">
                  {customer?.firstName} {customer?.lastName}
                </h2>
                <p className="text-sm text-slate-500 truncate">
                  {customer?.city}, {customer?.state}
                </p>
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex flex-row md:flex-col justify-between items-center gap-2">
                <span
                  className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-sm font-medium ${
                    customer?.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  <svg
                    className="w-3 h-3"
                    viewBox="0 0 8 8"
                    fill="currentColor"
                    aria-hidden
                  >
                    <circle cx="4" cy="4" r="3" />
                  </svg>
                  {customer?.status}
                </span>

                <span className="text-xs text-slate-400">
                  Joined: {new Date(customer?.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Customer details */}
          <div className="">
            <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <ViewField label="Aadhar Number" value={customer?.aadharNumber} />
              <ViewField label="PAN Number" value={customer?.panCardNumber} />
              <ViewField label="Mobile" value={customer?.mobileNumber} />
              <ViewField
                label="Address"
                value={`${customer?.address}, ${customer?.city}, ${customer?.state}, ${customer?.pinCode}`}
              />
            </div>

            {/* Images */}
            <div className="p-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
              {customer?.aadharFile && (
                <ImageCard
                  label="Aadhar Card"
                  src={customer?.aadharFile.image}
                />
              )}
              {customer?.panCardFile && (
                <ImageCard label="PAN Card" src={customer?.panCardFile.image} />
              )}
              {customer?.agreementFile && (
                <ImageCard
                  label="Agreement"
                  src={customer?.agreementFile.image}
                />
              )}
              {customer?.otherFile && (
                <ImageCard
                  label="Other Image"
                  src={customer?.otherFile.image}
                />
              )}
            </div>
          </div>
          {/* Loan Details Section */}
          {customer?.loans?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-slate-700 mb-3">
                Loan Details
              </h3>

              {customer?.loans.map((loan) => (
                <div
                  key={loan?.id}
                  className="p-4 mb-4 rounded-lg border border-slate-200 bg-white shadow-sm"
                >
                  {/* Basic Loan Info */}
                  <div className="grid grid-cols-2 md:grid-cols-2 sm:grid-cols-2 gap-4">
                    <ViewField
                      label="Loan Amount"
                      value={`₹ ${loan?.amount}`}
                    />
                    <ViewField
                      label="Interest Rate"
                      value={`${loan?.interestRate}%`}
                    />
                    <ViewField
                      label="EMIs (Months)"
                      value={loan?.tenureMonths}
                    />
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
                      label="Received Payments"
                      value={`₹ ${loan?.repaymentsReceived}`}
                    />
                    <ViewField
                      label="Pending Payments"
                      value={`₹ ${loan?.repaymentsPending}`}
                    />
                  </div>

                  {/* Description */}
                  {loan?.description && (
                    <div className="mt-3">
                      <ViewField
                        label="Description"
                        value={`${loan?.description}`}
                      />
                    </div>
                  )}

                  {/* Transactions */}
                  {loan?.transactions?.length > 0 && (
                    <div className="mt-4">
                      <div className="text-sm font-semibold text-slate-700 mb-2">
                        Transactions
                      </div>
                      <div className="space-y-2">
                        {loan?.transactions.map((txn, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center p-2 rounded-md bg-slate-50 border border-slate-100"
                          >
                            <span className="text-sm text-slate-600">
                              {`Payment`}
                            </span>
                            <span className="text-sm text-slate-600">
                              {txn?.transactionType === "Disbursement"
                                ? "Pay Loan"
                                : txn?.transactionType}
                            </span>
                            <span
                              className={`text-sm font-medium ${
                                txn?.transactionType === "Disbursement"
                                  ? "text-danger"
                                  : "text-green-600"
                              } `}
                            >
                              ₹ {txn.amount || 0}
                            </span>
                            <span className="text-xs text-slate-400">
                              {txn.paymentMode || "-"}
                            </span>
                            <span className="text-xs text-slate-400">
                              {txn.transactionDate || "-"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      }
    />
  );
};

function ImageCard({ label, src }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4 bg-slate-50 shadow-sm">
      <div className="text-xs text-slate-500 mb-2">{label}</div>
      <iframe
        src={src}
        alt={label}
        className="w-full h-48 object-contain rounded-md bg-white"
      />
    </div>
  );
}
export default CustomerDetailModal;
