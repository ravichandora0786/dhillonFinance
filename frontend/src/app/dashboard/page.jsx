"use client";
import React, { useState } from "react";

export default function Dashboard() {
  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard Overview
          </h1>
          <p className="text-gray-500">
            Manage your customers, keep track of every rupee.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Customers */}
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500">Total Customers</p>
            <h2 className="text-2xl font-bold text-gray-800">45</h2>
            <p className="text-sm text-gray-400">Active customers</p>
          </div>

          {/* Money to Receive */}
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500">Money to Receive</p>
            <h2 className="text-2xl font-bold text-green-600">₹25,000</h2>
            <p className="text-sm text-gray-400">Total credit</p>
          </div>

          {/* Money Given */}
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500">Money Given</p>
            <h2 className="text-2xl font-bold text-orange-500">₹18,000</h2>
            <p className="text-sm text-gray-400">Total debit</p>
          </div>

          {/* Pending Payments */}
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500">Pending Payments</p>
            <h2 className="text-2xl font-bold text-red-500">₹7,000</h2>
            <p className="text-sm text-gray-400">Needs follow-up</p>
          </div>
        </div>

        {/* Quick Actions + Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Quick Actions
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Common tasks to manage your business
            </p>

            <div className="flex flex-col gap-3">
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-medium flex items-center gap-2">
                ➕ Add New Customer
              </button>
              <button className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm font-medium flex items-center gap-2">
                📈 Record Payment Received
              </button>
              <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 text-sm font-medium flex items-center gap-2">
                📊 View Reports
              </button>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Recent Transactions
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Latest customer transactions
            </p>

            <div className="flex flex-col divide-y">
              <div className="flex justify-between py-3">
                <div>
                  <p className="font-medium text-gray-800">Rajesh Kumar</p>
                  <p className="text-sm text-gray-500">Today</p>
                </div>
                <div className="text-right">
                  <p className="text-green-600 font-semibold">+₹500</p>
                  <p className="text-sm text-gray-500">Received</p>
                </div>
              </div>

              <div className="flex justify-between py-3">
                <div>
                  <p className="font-medium text-gray-800">Priya Sharma</p>
                  <p className="text-sm text-gray-500">Yesterday</p>
                </div>
                <div className="text-right">
                  <p className="text-red-500 font-semibold">-₹1200</p>
                  <p className="text-sm text-gray-500">Given</p>
                </div>
              </div>

              <div className="flex justify-between py-3">
                <div>
                  <p className="font-medium text-gray-800">Amit Singh</p>
                  <p className="text-sm text-gray-500">2 days ago</p>
                </div>
                <div className="text-right">
                  <p className="text-green-600 font-semibold">+₹800</p>
                  <p className="text-sm text-gray-500">Received</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
