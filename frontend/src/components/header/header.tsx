import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import UserDropdown from "./userDropdown";
import { MdOutlineNotificationsActive } from "react-icons/md";

export default function Header() {
  return (
    <header className="flex h-12 items-center justify-between  bg-Neutral text-red-500">
      <div className="flex items-center">
        {/* Your logo or any other content on the left side */}
      </div>

      <div className="relative right-4 flex items-center ">
        <MdOutlineNotificationsActive
          className="mr-4 text-gray-600 "
          size={28}
        />
        <div className="relative top-1 inline-block text-left">
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}
