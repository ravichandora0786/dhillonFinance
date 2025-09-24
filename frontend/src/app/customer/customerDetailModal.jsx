"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GenericModal from "@/components/ui/genericModal";

const CustomerDetailModal = ({ openModal, onBack = () => {}, data }) => {
  const dispatch = useDispatch();
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
                  <img
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
              <Field label="Aadhar Number" value={customer?.aadharNumber} />
              <Field label="PAN Number" value={customer?.panCardNumber} />
              <Field label="Mobile" value={customer?.mobileNumber} />
              <Field
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
            </div>
          </div>
        </div>
      }
    />
  );
};

function Field({ label, value }) {
  return (
    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
      <div className="text-xs text-slate-400">{label}</div>
      <div className="mt-1 text-sm text-slate-800 font-medium break-words">
        {value}
      </div>
    </div>
  );
}

function ImageCard({ label, src }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4 bg-slate-50 shadow-sm">
      <div className="text-xs text-slate-500 mb-2">{label}</div>
      <img
        src={src}
        alt={label}
        className="w-full h-48 object-contain rounded-md bg-white"
      />
    </div>
  );
}
export default CustomerDetailModal;
