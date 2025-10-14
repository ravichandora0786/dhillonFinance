import React, { useEffect } from "react";
import NameAvatarColumn from "../tableCollumnComponents/nameWithImageCol";
import { useDispatch, useSelector } from "react-redux";
import { selectAllTransactionList } from "@/app/transaction/selector";
import { getAllTransactions } from "@/app/transaction/slice";
import TitleAndDescription from "./titleAndDescription";

const RecentTransactions = () => {
  const dispatch = useDispatch();
  const transactionData = useSelector(selectAllTransactionList);
  const getRecentTransactionsList = () => {
    dispatch(
      getAllTransactions({
        data: { page: 1, limit: 5, sortBy: "createdAt", order: "DESC" },
        onSuccess: () => {},
        onFailure: () => {},
      })
    );
  };
  useEffect(() => {
    getRecentTransactionsList();
  }, [dispatch]);
  return (
    <div className="bg-white rounded-lg shadow p-4 max-h-[400px] overflow-auto scrollbar-hide">
      <TitleAndDescription
        title="Recent Transactions"
        description="Track your borrowers’ latest loan activities"
      />

      <div className="flex flex-col divide-y">
        {transactionData?.transactions?.length > 0 ? (
          transactionData?.transactions?.map((t, idx) => (
            <div key={idx} className="flex justify-between py-3">
              <div>
                <NameAvatarColumn
                  name={`${t?.customer?.firstName} ${t?.customer?.lastName} s/o ${t?.customer?.fatherName}`}
                  mobileNumber={`${t.customer.mobileNumber}`}
                  showImage={true}
                  showMobile={true}
                  imageUrl={t.customer?.profileFile?.image}
                />
              </div>
              <div className="text-right">
                <div
                  className={`${
                    t?.transactionType === "Repayment"
                      ? "text-green-600"
                      : "text-red-500"
                  } font-semibold`}
                >
                  {t?.transactionType === "Repayment" ? "+" : "-"}₹
                  {parseFloat(t?.amount) + parseFloat(t?.lateEMICharges)}
                </div>
                <div className="text-sm text-gray-500">
                  {t?.transactionType === "Repayment"
                    ? "Received"
                    : "Disbursed Loan"}
                </div>
                <div className="pl-8 text-sm text-gray-500">
                  {formatRelativeDate(t?.transactionDate)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500 text-center py-4">
            No Transactions found
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;

// Helper function to format date
const formatRelativeDate = (dateString) => {
  if (!dateString) return "";

  const transactionDate = new Date(dateString);
  const today = new Date();

  // Remove time portion for accurate day comparison
  transactionDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = today - transactionDate; // in milliseconds
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
};
