"use client";
import React, { useEffect, useState } from "react";
import {
  FiUserPlus,
  FiCreditCard,
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiAlertCircle,
} from "react-icons/fi";
import ReceiveMoneyModal from "@/components/ui/pagesComponents/receiveMoneyModal";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardData } from "./slice";
import { selectDashboardData } from "./selectors";
import RecentTransactions from "@/components/ui/recentTransactions";
import UpCommingEMILoan from "@/components/ui/upCommingEMILoan";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [openReceivedMoneyModal, setOpenReceivedMoneyModal] = useState(false);

  const data = useSelector(selectDashboardData);

  const getDashboardDataList = () => {
    dispatch(
      getDashboardData({
        onSuccess: () => {},
        onFailure: () => {},
      })
    );
  };

  useEffect(() => {
    getDashboardDataList();
  }, [dispatch]);
  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Title */}
        <div className="flex flex-col gap-0 mb-6">
          <span className="text-2xl font-bold text-gray-800">
            Dashboard Overview
          </span>
          <span className="text-sm text-gray-500">
            Manage your borrowers and track all financial transactions.
          </span>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card
            icon={<FiUsers className="text-3xl text-blue-500" />}
            title="Active Borrowers"
            value={data?.customerStats?.totalCustomers || 0}
            subtitle="Loan Customers"
          />
          <Card
            icon={<FiDollarSign className="text-3xl text-green-500" />}
            title="Disbursed Amount"
            value={`₹${data?.repaymentStats?.totalDisbursedAmount || 0}`}
            subtitle="Active Loan Principal Amount"
          />
          <Card
            icon={<FiTrendingUp className="text-3xl text-orange-500" />}
            title="Collection Amount"
            value={`₹${data?.repaymentStats?.totalRepaymentsReceived || 0}`}
            subtitle="Active Loan Collection With Int & charges"
          />
          <Card
            icon={<FiAlertCircle className="text-3xl text-red-500" />}
            title="Receivables Amount"
            value={`₹${data?.repaymentStats?.totalRepaymentsPending || 0}`}
            subtitle="Active Loan Pending Amount With Int"
          />
        </div>

        {/* Quick Actions + Recent Transactions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Quick Actions
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Perform common operations quickly
            </p>

            <div className="grid grid-cols-2 gap-4">
              {/* Card Button */}
              <button
                className="flex flex-col items-center justify-center gap-2 p-6 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 shadow-sm"
                onClick={() => {
                  router.push("/customer/add");
                }}
              >
                <FiUserPlus className="text-2xl" />
                <span className="text-sm font-medium">Add Borrower</span>
              </button>
              <button
                className="flex flex-col items-center justify-center gap-2 p-6 
          bg-green-50 text-green-600 rounded-lg hover:bg-green-100 shadow-md transition"
                onClick={() => {
                  router.push("/loan/add");
                }}
              >
                <FiDollarSign className="text-2xl" />
                <span className="text-sm font-medium">Add Borrower Loan</span>
              </button>

              <button
                className="flex flex-col items-center justify-center gap-2 p-6 bg-orange-50 text-orange-500 rounded-lg hover:bg-orange-100 shadow-sm"
                onClick={() => {
                  setOpenReceivedMoneyModal(true);
                }}
              >
                <FiCreditCard className="text-2xl" />
                <span className="text-sm font-medium">Record Payment</span>
              </button>

              <button
                className="flex flex-col items-center justify-center gap-2 p-6 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 shadow-sm"
                onClick={() => {
                  router.push("/customer");
                }}
              >
                <FiUsers className="text-2xl" />
                <span className="text-sm font-medium">View Borrowers</span>
              </button>
            </div>
          </div>
          <RecentTransactions />
          <UpCommingEMILoan />
        </div>
      </div>

      <ReceiveMoneyModal
        openModal={openReceivedMoneyModal}
        onBack={() => {
          setOpenReceivedMoneyModal(false);
        }}
        data={null}
        callBackFunc={() => {
          getDashboardDataList();
        }}
      />
    </>
  );
}

function Card({ icon, title, value, subtitle }) {
  return (
    <div className="flex flex-col bg-white rounded-lg shadow p-4 items-center gap-4">
      {icon}
      <div>
        <label className="text-gray-500 text-sm">{title}</label>
        <h2 className="text-2xl font-bold text-gray-800">{value || 0}</h2>
        <span className="text-[10px] text-gray-400">{subtitle}</span>
      </div>
    </div>
  );
}
