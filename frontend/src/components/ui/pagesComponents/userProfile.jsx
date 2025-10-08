"use client";
import React, { useEffect, useState } from "react";
import {
  FaUserFriends,
  FaMoneyBill,
  FaStar,
  FaChartLine,
} from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";
import RecentTransactions from "../recentTransactions";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetailById } from "@/app/user/slice";
import { useParams, useRouter } from "next/navigation";
import { selectUserDetailData } from "@/app/user/selector";
import LoadingButton from "../loadingButton";
import { CiEdit } from "react-icons/ci";
import ViewField from "../viewField";
import { UserProfileUploadImage } from "../userProfileUploardImage";
import { UserFields } from "@/constants/fieldsName";
import TitleAndDescription from "../titleAndDescription";
import ChangePasswordComponent from "../changePasswordComponent";

const UserProfileComponent = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [activeTab, setActiveTab] = useState("overview");
  const [isChangePassword, setIsChangePassword] = useState(false);
  const user = useSelector(selectUserDetailData);

  const getUserDetail = (id) => {
    dispatch(
      getUserDetailById({
        id,
        onSuccess: () => {},
        onFailure: () => {},
      })
    );
  };

  useEffect(() => {
    if (id) {
      getUserDetail(id);
    }
  }, [id]);

  console.log(user, "user");

  const settings = [
    {
      title: "Change Password",
      description: "Update your password",
      buttonText: "Change",
      onClick: () => {
        setIsChangePassword(true);
      },
    },
  ];

  return (
    <>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-green-500 text-white rounded-lg p-6 relative">
          <div className="flex items-center">
            <UserProfileUploadImage
              fileId={user[UserFields.PROFILE_IMAGE]}
              userId={id}
              fieldName={UserFields.PROFILE_IMAGE}
            />
            {/* <div className="w-20 h-20 bg-white text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
            {user?.userName?.[0]?.toUpperCase()}
          </div> */}
            <div className="ml-4">
              <h2 className="text-2xl font-semibold">{user?.userName}</h2>

              <div className="flex gap-2 mt-2">
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                  {formatRelativeTime(user?.lastLoginAt)}
                </span>
              </div>
            </div>
          </div>
          <LoadingButton
            type="button"
            isLoading={false}
            disabled={false}
            onClick={() => {
              router.push(`/user/edit/${id}`);
            }}
            variant="custom"
            className="absolute top-2 right-2 text-white px-3 py-1"
          >
            <CiEdit className="text-white w-8 h-8" />
          </LoadingButton>
        </div>

        {/* Profile Completion */}
        {/* <div className="bg-white rounded-lg shadow p-4 mt-6">
          <h4 className="font-semibold">Complete Your Profile</h4>
          <p className="text-sm text-gray-500">
            Complete your profile to get better results
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div className="bg-green-500 h-2 rounded-full w-[85%]"></div>
          </div>
          <p className="text-right text-sm mt-1 font-semibold text-green-600">
            85%
          </p>
        </div> */}

        {/* Tabs */}
        <div className="flex gap-6 mt-6 border-b">
          {["overview", "personal", "security"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 capitalize ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                  : "text-gray-500"
              }`}
            >
              {tab === "overview" && "Overview"}
              {tab === "personal" && "Personal Info"}
              {tab === "security" && "Security"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-6">
            {/* Recent Activity */}
            <RecentTransactions />
          </div>
        )}
        {activeTab === "personal" && (
          <div className="flex flex-col justify-between mt-2 gap-4">
            <TitleAndDescription
              title="Personal Information"
              description="Update your personal details"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ViewField label="Full Name" value={`${user?.userName}`} />
              <ViewField label="Email" value={user?.email} />
              <ViewField label="Mobile Number" value={user?.mobileNumber} />
              <ViewField label="Gender" value={user?.gender} />
              <ViewField label="Date of Birth" value={user?.dob} />
            </div>
          </div>
        )}
        {activeTab === "security" && (
          <div className="flex flex-col justify-between mt-2 gap-4">
            <TitleAndDescription
              title="Security Settings"
              description="Keep your account secure"
            />
            <div className="space-y-4">
              {settings?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border rounded-lg py-2 px-4 hover:shadow-sm transition"
                >
                  {/* Left side: Title + Description */}

                  <TitleAndDescription
                    title={item.title}
                    description={item.description}
                  />

                  {/* Right side: Action Button */}
                  <button
                    className="px-4 py-1 text-sm font-medium border rounded-md bg-gray-100 hover:bg-gray-150"
                    onClick={item?.onClick}
                  >
                    {item.buttonText}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <ChangePasswordComponent
        openModal={isChangePassword}
        onBack={() => {
          setIsChangePassword(false);
        }}
      />
    </>
  );
};

export default UserProfileComponent;

// utils/formatRelativeTime.js
export const formatRelativeTime = (dateString) => {
  if (!dateString) return "";

  const lastLogin = new Date(dateString);
  const now = new Date();

  const diffMs = now - lastLogin;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return "Active just now";
  if (diffMinutes < 60) return `Active ${diffMinutes} min ago`;
  if (diffHours < 24)
    return `Active ${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  return `Active ${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
};
