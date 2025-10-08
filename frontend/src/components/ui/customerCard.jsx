"use client";
import React, { useState } from "react";
import {
  FiMoreVertical,
  FiEdit,
  FiEye,
  FiArrowRight,
  FiTrash2,
  FiMessageCircle,
  FiPhone,
  FiMail,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { MdOutlinePhone } from "react-icons/md";
import { TbMessage } from "react-icons/tb";
import LoadingButton from "./loadingButton";
import Link from "next/link";
import NameAvatarColumn from "../tableCollumnComponents/nameWithImageCol";
import { removeTimeFromDate } from "@/Services/utils";
import ActionColumnsComponent from "../tableCollumnComponents/actionColumn";
import { useRouter } from "next/navigation";

const CustomerCardComponent = ({
  customer,
  handleDelete,
  handleView,
  handleReceivedMoneyBtn,
  handleCloseCustomerLoan,
}) => {
  const router = useRouter();

  return (
    <div className="col-span-1 flex">
      <div className="w-full bg-white border rounded-lg shadow flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-2">
          <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full flex items-center">
            <span className="w-2 h-2 rounded-full bg-green-600 mr-1"></span>
            Active
          </span>
          <div className="">
            <ActionColumnsComponent
              showDeleteButton={true}
              showEditLink={true}
              editOnLink={`/customer/edit/${customer.id}`}
              deleteOnClick={() => handleDelete(customer)}
              showViewButton={true}
              viewOnClick={() => {
                handleView(customer);
              }}
            />
          </div>
        </div>

        {/* Body */}
        <div className="px-4 py-3">
          <div className="bg-gray-100 rounded-lg p-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 px-1 py-0">
                <div className="flex-shrink-0">
                  <iframe
                    alt={"PI"}
                    src={
                      customer?.profileFile?.image ||
                      "https://img.freepik.com/free-vector/smiling-young-…tion_1308-173524.jpg?semt=ais_incoming&w=740&q=80"
                    }
                    className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
                  />
                </div>
                <div className="flex flex-col justify-between items-start">
                  <span className="text-lg font-medium text-gray-800">
                    {`${customer.firstName} ${customer.lastName}`}
                  </span>

                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <FiPhone size={12} className="text-gray-400" />
                    {customer.mobileNumber}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-row justify-between items-center text-sm gap-2">
            <div>
              <p className="text-gray-500">Aadhar No</p>
              <p className="font-medium text-gray-800">
                {customer?.aadharNumber || "xxxx-xxxx-xxxx"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Loan Status</p>
              <p className="font-medium text-gray-800">
                {customer?.loans[0]?.status || "--"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Joined On</p>
              <p className="font-medium text-gray-800">
                {removeTimeFromDate(customer?.createdAt) || "--"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t px-1 py-2">
          <div className="flex items-center gap-1">
            <LoadingButton
              type="button"
              isLoading={false}
              disabled={false}
              onClick={() => {
                window.open(`tel:${customer.mobileNumber}`);
              }}
              variant="custom"
              className="w-8 h-8 p-0"
            >
              <FiPhone size={24} />
            </LoadingButton>
            <LoadingButton
              type="button"
              isLoading={false}
              disabled={false}
              onClick={() => {
                const number = customer?.mobileNumber;

                const emiDate =
                  customer?.loans?.[0]?.installmentDate || "Not Available";
                const nextEmiAmount = customer?.loans?.[0]?.nextEmiAmount || 0;
                const pendingAmount =
                  customer?.loans?.[0]?.repaymentsPending || 0;

                const message = `Dear ${customer?.firstName}, your next EMI is due on ${emiDate}. The EMI amount is ₹${nextEmiAmount}, and your total pending loan amount is ₹${pendingAmount}. Please make your payment on time to avoid penalties.`;
                window.open(
                  `https://wa.me/${number}?text=${encodeURIComponent(message)}`,
                  "_blank"
                );
              }}
              variant="custom"
              className="w-8 h-8 p-0"
            >
              <FaWhatsapp size={24} />
            </LoadingButton>
            <LoadingButton
              type="button"
              isLoading={false}
              disabled={false}
              onClick={() => {
                const number = customer?.mobileNumber;

                const emiDate =
                  customer?.loans?.[0]?.installmentDate || "Not Available";
                const nextEmiAmount = customer?.loans?.[0]?.nextEmiAmount || 0;
                const pendingAmount =
                  customer?.loans?.[0]?.repaymentsPending || 0;

                const message = `Dear ${customer?.firstName}, your next EMI is due on ${emiDate}. The EMI amount is ₹${nextEmiAmount}, and your total pending loan amount is ₹${pendingAmount}. Please make your payment on time to avoid penalties.`;

                window.location.href = `sms:${number}?body=${encodeURIComponent(
                  message
                )}`;
              }}
              variant="custom"
              className="w-8 h-8 p-0"
            >
              <TbMessage size={24} />
            </LoadingButton>
          </div>

          {/* Loan Buttons */}
          <div className="flex flex-row gap-2">
            {customer?.loans?.length >= 0 &&
            customer?.loans[0]?.status === "Active" ? (
              <>
                <div>
                  {" "}
                  <LoadingButton
                    type="button"
                    isLoading={false}
                    disabled={false}
                    onClick={() => {
                      handleCloseCustomerLoan(customer);
                    }}
                  >
                    Close Loan
                  </LoadingButton>
                </div>
                <div>
                  {" "}
                  <LoadingButton
                    type="button"
                    isLoading={false}
                    disabled={false}
                    onClick={() => {
                      handleReceivedMoneyBtn(customer);
                    }}
                  >
                    Receive Money
                  </LoadingButton>
                </div>
              </>
            ) : (
              <div>
                {" "}
                <LoadingButton
                  type="button"
                  isLoading={false}
                  disabled={false}
                  onClick={() => {
                    router.push("/loan/add");
                  }}
                  variant="danger"
                >
                  Give Loan
                </LoadingButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerCardComponent;
