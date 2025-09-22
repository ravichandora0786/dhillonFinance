import React from "react";

const STATUS_STYLES = {
  Success: {
    border: "border border-[#2EB845]",
    text: "text-[#2EB845] bg-[rgba(46,184,69,0.05)]",
  },
  Block: {
    border: "border border-[#000000]",
    text: "text-[#000000] bg-[rgba(180,247,250,0.05)]",
  },
  Pending: {
    border: "border border-[#FA8C16] bg-[#FFF7E6]",
    text: "text-[#FA8C16]",
  },
  MissedPayment: {
    border: "border border-red-500 bg-[#FFF7E6]",
    text: "text-orange-600",
  },
  Declined: {
    border: "border border-[#F5222D] bg-[#FFF1F0]",
    text: "text-[#F5222D]",
  },
  Refunded: {
    border: "border border-[#722ED1] bg-[#F9F0FF]",
    text: "text-[#722ED1]",
  },
  Dispute: {
    border: "border border-[#F5222D] bg-[#FFF1F0]",
    text: "text-[#F5222D]",
  },
  Processing: {
    border: "border border-[#FA8C16] bg-[#FFF7E6]",
    text: "text-[#FA8C16]",
  },
  Won: {
    border: "border border-[#92A6AF] bg-[#F8FCFF]",
    text: "text-[#92A6AF]",
  },
  Due: {
    border: "border border-[#87E8DE]",
    text: "text-[#13C2C2] bg-[#E6FFFB]",
  },
  Pink: {
    border: "border border-[#FFADD2]",
    text: "text-[#EB2F96] bg-[#FFF0F6]",
  },
  Grey: {
    border: "border border-[#92A6AF]",
    text: "text-[#92A6AF] bg-[#F8FCFF]",
  },
  Blue: {
    border: "border border-[#1890FF]",
    text: "text-[#1890FF] bg-[#F8FCFF]",
  },
  Active: {
    border: "border border-[#2EB845]",
    text: "text-[#2EB845] bg-[rgba(46,184,69,0.05)]",
  },
  Inactive: {
    border: "border border-[#F5222D]",
    text: "text-[#F5222D] bg-[rgba(245,34,45,0.05)]",
  },
  Approved: {
    border: "border border-[#2EB845]",
    text: "text-[#2EB845] bg-[rgba(46,184,69,0.05)]",
  },
  Rejected: {
    border: "border border-[#F5222D]",
    text: "text-[#F5222D] bg-[rgba(245,34,45,0.05)]",
  },
  AuthPending: {
    border: "border border-[#FFA500]",
    text: "text-[#FFA500] bg-[rgba(255,165,0,0.05)]",
  },
};

const Status = ({ text, status, authStatus }) => {
  const getStatusDisplay = (s, a) => {
    s = s?.toUpperCase();
    a = a?.toUpperCase();

    if (s === "I" && a === "I") return "Created";
    if (s === "I" && a === "P") return "Created";
    if (s === "A" && a === "P") return "Pending";
    if (s === "I" && a === "A") return "Approved";
    if (s === "A" && a === "A") return "Approved";
    if (s === "I" && a === "R") return "Rejected";
    if (s === "A" && a === "R") return "Rejected";
    if (s === "I" || a === "B") return "Block";
    if (s === "A" || a === "B") return "Block";

    return "Unknown";
  };

  const displayValue = text || getStatusDisplay(status, authStatus);

  const style = STATUS_STYLES[displayValue] || {
    border: "border border-gray-400",
    text: "text-gray-500 bg-gray-100",
  };

  return (
    <div
      className={`inline-block rounded-xl px-2 py-1 text-xs font-medium ${style.border}`}
    >
      <span className={`${style.text}`}>{displayValue}</span>
    </div>
  );
};

export default Status;
