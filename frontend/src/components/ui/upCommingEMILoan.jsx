import React, { useEffect } from "react";
import NameAvatarColumn from "../tableCollumnComponents/nameWithImageCol";
import { useDispatch, useSelector } from "react-redux";
import { upCommingEmiLoanList } from "@/app/loan/slice";
import { selectUpcommingEmiList } from "@/app/loan/selector";
import TitleAndDescription from "./titleAndDescription";

const UpcomingEMILoan = () => {
  const dispatch = useDispatch();
  const dataList = useSelector(selectUpcommingEmiList);

  const getUpcomingEmiLoanList = () => {
    dispatch(
      upCommingEmiLoanList({
        data: { days: 3, includeToday: false },
        onSuccess: () => {},
        onFailure: () => {},
      })
    );
  };

  useEffect(() => {
    getUpcomingEmiLoanList();
  }, [dispatch]);

  return (
    <div className="bg-white rounded-lg shadow p-4 min-h-[200px] max-h-[400px] overflow-auto scrollbar-hide">
      {/* Updated title and description */}
      <TitleAndDescription
        title="Upcoming EMI"
        description="Keep track of customers whose loan EMI is comming soon"
      />

      <div className="flex flex-col divide-y">
        {dataList?.length > 0 ? (
          dataList.map((loan, idx) => (
            <div key={idx} className="flex justify-between py-3">
              <div>
                <NameAvatarColumn
                  name={`${loan?.customer?.firstName} ${loan?.customer?.lastName} s/o ${loan?.customer?.fatherName}`}
                  mobileNumber={loan?.customer?.mobileNumber}
                  showImage={true}
                  showMobile={true}
                  imageUrl={loan?.customer?.profileFile?.image}
                />
              </div>
              <div className="text-right">
                <div className={`text-green-600 font-semibold`}>
                  {`₹${loan?.nextEmiAmount || 0}`}
                </div>
                <div className="pl-8 text-sm text-gray-500">
                  {formatRelativeDate(loan?.installmentDate)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500 text-center py-4">
            No upcoming EMI loans found
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingEMILoan;

// Helper function to format relative date
const formatRelativeDate = (dateString) => {
  if (!dateString) return "";

  const transactionDate = new Date(dateString);
  const today = new Date();

  transactionDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = transactionDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  return `In ${diffDays} days`;
};
