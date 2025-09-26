"use client";
import React from "react";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const UserProfileComponent = ({ user }) => {
  return (
    <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Profile Image */}
      <div className="flex justify-center mt-6">
        <img
          className="w-28 h-28 rounded-full border-4 border-white shadow-md"
          src={user?.avatar || "https://via.placeholder.com/150"}
          alt="User Avatar"
        />
      </div>

      {/* Name and Designation */}
      <div className="text-center mt-4 px-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          {user?.name || "John Doe"}
        </h2>
        <p className="text-gray-500 mt-1">
          {user?.designation || "Software Engineer"}
        </p>
      </div>

      {/* Bio */}
      <div className="px-6 mt-4">
        <p className="text-gray-600 text-sm text-center">
          {user?.bio ||
            "Passionate developer with experience in building modern web applications using React and Tailwind CSS."}
        </p>
      </div>

      {/* Contact Info */}
      <div className="px-6 mt-6">
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <FiMail />
          <span>{user?.email || "john.doe@example.com"}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <FiPhone />
          <span>{user?.phone || "+1 234 567 890"}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <FiMapPin />
          <span>{user?.location || "San Francisco, CA"}</span>
        </div>
      </div>

      {/* Social Links */}
      <div className="flex justify-center gap-4 mb-6">
        <a
          href={user?.facebook || "#"}
          className="text-blue-600 hover:text-blue-800 transition"
        >
          <FaFacebookF />
        </a>
        <a
          href={user?.twitter || "#"}
          className="text-blue-400 hover:text-blue-600 transition"
        >
          <FaTwitter />
        </a>
        <a
          href={user?.linkedin || "#"}
          className="text-blue-700 hover:text-blue-900 transition"
        >
          <FaLinkedinIn />
        </a>
      </div>
    </div>
  );
};

export default UserProfileComponent;
