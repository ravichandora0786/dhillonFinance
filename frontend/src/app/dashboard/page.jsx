"use client";
import React, { useEffect, useState } from "react";
import {
  FiUserPlus,
  FiCreditCard,
  FiBarChart2,
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiAlertCircle,
} from "react-icons/fi";
import ReceiveMoneyModal from "../customer/receiveMoneyModal";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardData } from "./slice";
import { selectDashboardData } from "./selectors";
import { getAllTransactions } from "@/app/transaction/slice";
import { selectAllTransactionList } from "@/app/transaction/selector";
import NameAvatarColumn from "@/components/tableCollumnComponents/nameWithImageCol";
import RecentTransactions from "@/components/ui/recentTransactions";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [openReceivedMoneyModal, setOpenReceivedMoneyModal] = useState(false);

  const data = useSelector(selectDashboardData);
  // const transactionData = useSelector(selectAllTransactionList);

  const getDashboardDataList = () => {
    dispatch(
      getDashboardData({
        onSuccess: () => {},
        onFailure: () => {},
      })
    );
  };
  // const getRecentTransactionsList = () => {
  //   dispatch(
  //     getAllTransactions({
  //       data: { page: 1, limit: 5, sortBy: "createdAt", order: "DESC" },
  //       onSuccess: () => {},
  //       onFailure: () => {},
  //     })
  //   );
  // };

  useEffect(() => {
    getDashboardDataList();
    // getRecentTransactionsList();
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
            title="Total Borrowers"
            value={data?.customerStats?.totalCustomers}
            subtitle="Loan Customers"
          />
          <Card
            icon={<FiDollarSign className="text-3xl text-green-500" />}
            title="Disbursed Amount"
            value={`₹${data?.repaymentStats?.totalDisbursedAmount}`}
            subtitle="Principal Amount"
          />
          <Card
            icon={<FiTrendingUp className="text-3xl text-orange-500" />}
            title="Collection Amount"
            value={`₹${data?.repaymentStats?.totalRepaymentsReceived}`}
            subtitle="Collection Amount With Intrest"
          />
          <Card
            icon={<FiAlertCircle className="text-3xl text-red-500" />}
            title="Receivables Amount"
            value={`₹${data?.repaymentStats?.totalRepaymentsPending}`}
            subtitle="Pending Amount With Intrest"
          />
        </div>

        {/* Quick Actions + Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

              {/* <button className="flex flex-col items-center justify-center gap-2 p-6 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 shadow-sm">
                <FiBarChart2 className="text-2xl" />
                <span className="text-sm font-medium">View Reports</span>
              </button> */}
            </div>
          </div>
          <RecentTransactions/>
        </div>
      </div>

      <ReceiveMoneyModal
        openModal={openReceivedMoneyModal}
        onBack={() => {
          setOpenReceivedMoneyModal(false);
        }}
        data={{}}
        callBackFunc={() => {
          getDashboardDataList();
          getRecentTransactionsList();
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
        <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
        <span className="text-[10px] text-gray-400">{subtitle}</span>
      </div>
    </div>
  );
}

// function RecentTransactions({ transactions = [] }) {
//   return (
//     <div className="bg-white rounded-lg shadow p-4">
//       <h3 className="text-lg font-semibold text-gray-800">
//         Recent Transactions
//       </h3>
//       <p className="text-sm text-gray-500 mb-4">Latest borrower activities</p>

//       <div className="flex flex-col divide-y">
//         {transactions?.map((t, idx) => (
//           <div key={idx} className="flex justify-between py-3">
//             <div>
//               <NameAvatarColumn
//                 name={`${t?.customer?.firstName} ${t?.customer?.lastName}`}
//                 mobileNumber={`${t.customer.mobileNumber}`}
//                 showImage={true}
//                 showMobile={true}
//                 imageUrl={t.customer?.profileFile?.image}
//               />
//               {/* <p className="text-sm text-gray-500">{t?.transactionDate}</p> */}
//             </div>
//             <div className="text-right">
//               <p
//                 className={`${
//                   t?.transactionType === "Repayment"
//                     ? "text-green-600"
//                     : "text-red-500"
//                 } font-semibold`}
//               >
//                 {t?.transactionType === "Repayment" ? "+" : "-"}₹{t?.amount}
//               </p>
//               <p className="text-sm text-gray-500">
//                 {t?.transactionType === "Repayment"
//                   ? "Received"
//                   : "Disbursed Loan"}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
