"use client";
import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../community/Community-Sidebar";

import SectionHeader from "../../components/SectionHeader";
function page() {
  return (
    <>
      <div className="flex flex-col md:mt-10 md:flex-row">
        {" "}
        <Sidebar />{" "}
        <div className="flex flex-col md:mx-10">
          {" "}
          <SectionHeader title="Dashboard">
            {" "}
            <p>Company Name: [Insert Company Name]</p>{" "}
          </SectionHeader>{" "}
          <div className="l mx-auto p-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Featured Listing
            </h2>
            <div className="p-4 border-blue-500 rounded-lg border-2 pt-4 shadow-sm mt-2  flex gap-4">
              {/* Free Listing */}
              <div className="border rounded-lg p-4 relative">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Free Listing
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  All listings on Seniorplicity.com start out free.
                </p>
                <ul className="list-none space-y-2">
                  <li className="flex items-center text-gray-800">
                    <span className="text-green-500 mr-2">✔</span> Business
                    Listing
                  </li>
                  <li className="flex items-center text-gray-800">
                    <span className="text-green-500 mr-2">✔</span> Photo
                  </li>
                  <li className="flex items-center text-gray-800">
                    <span className="text-green-500 mr-2">✔</span> Post Events
                  </li>
                  <li className="flex items-center text-gray-800">
                    <span className="text-green-500 mr-2">✔</span> Send and
                    receive email blasts
                  </li>
                  <li className="flex items-center text-gray-800">
                    <span className="text-green-500 mr-2">✔</span> Connect with
                    other Users
                  </li>
                  <li className="flex items-center text-gray-800">
                    <span className="text-green-500 mr-2">✔</span> Post Offers
                  </li>
                  <li className="flex items-center text-gray-800">
                    <span className="text-green-500 mr-2">✔</span> Appear in
                    search results
                  </li>
                  <li className="flex items-center text-gray-400">
                    <span className="text-red-500 mr-2">✘</span> Appear in
                    Featured Results
                  </li>
                  <li className="flex items-center text-gray-400">
                    <span className="text-red-500 mr-2">✘</span> Incentives
                    featured in Community dashboards
                  </li>
                  <li className="flex items-center text-gray-400">
                    <span className="text-red-500 mr-2">✘</span> Events featured
                    in Community dashboards
                  </li>
                  <li className="flex items-center text-gray-400">
                    <span className="text-red-500 mr-2">✘</span> Profile picture
                    in Community dashboards
                  </li>
                  <li className="flex items-center text-gray-400">
                    <span className="text-red-500 mr-2">✘</span> Enhanced
                    Business Profile
                  </li>
                  <li className="flex items-center text-gray-400">
                    <span className="text-red-500 mr-2">✘</span> Appear on the
                    Home Page (if limit is available)
                  </li>
                  <li className="flex items-center text-gray-400">
                    <span className="text-red-500 mr-2">✘</span> Enhanced User
                    Dashboards
                  </li>
                  <li className="flex items-center text-gray-400">
                    <span className="text-red-500 mr-2">✘</span> Email Alerts
                    when a Business registers as Sales Director
                  </li>
                  <li className="flex items-center text-gray-400">
                    <span className="text-red-500 mr-2">✘</span> Email Alerts
                    when a Business updates name
                  </li>
                </ul>
                <div className=" bottom-4 pt-3 left-4 text-xl font-bold text-gray-800">
                  FREE
                </div>
              </div>

              {/* Featured Listing */}
              <div className="border rounded-lg p-4 relative">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Featured Listing
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Upgrade your listing to a featured listing.
                </p>
                <ul className="list-none space-y-2">
                  <li className="flex items-center text-gray-800">
                    <span className="text-green-500 mr-2">✔</span> Business
                    Listing
                  </li>
                  <li className="flex items-center text-gray-800">
                    <span className="text-green-500 mr-2">✔</span> Photo
                  </li>
                  <li className="flex items-center text-gray-800">
                    <span className="text-green-500 mr-2">✔</span> Post Events
                  </li>
                  <li className="flex items-center text-gray-800">
                    <span className="text-green-500 mr-2">✔</span> Send and
                    receive email blasts
                  </li>
                  <li className="flex items-center text-gray-800">
                    <span className="text-green-500 mr-2">✔</span> Connect with
                    other Users
                  </li>
                  <li className="flex items-center text-gray-800">
                    <span className="text-green-500 mr-2">✔</span> Post Offers
                  </li>
                  <li className="flex items-center text-gray-800">
                    <span className="text-green-500 mr-2">✔</span> Appear in
                    search results
                  </li>
                  <li className="flex items-center text-gray-800">
                    <span className="text-green-500 mr-2">✔</span> Appear in
                    Featured Results
                  </li>
                  <li className="flex items-center text-gray-800">
                    <span className="text-green-500 mr-2">✔</span> Incentives
                    featured in Community dashboards
                  </li>
                  <li className="flex items-center text-gray-800">
                    <span className="text-green-500 mr-2">✔</span> Events
                    featured in Community dashboards
                  </li>
                  <li className="flex items-center text-gray-800">
                    <span className="text-green-500 mr-2">✔</span> Profile
                    picture in Community dashboards
                  </li>
                  <li className="flex items-center text-gray-800">
                    <span className="text-green-500 mr-2">✔</span> Enhanced
                    Business Profile
                  </li>
                  <li className="flex items-center text-gray-800">
                    <span className="text-green-500 mr-2">✔</span> Appear on the
                    Home Page (if limit is available)
                  </li>
                  <li className="flex items-center text-gray-800">
                    <span className="text-green-500 mr-2">✔</span> Enhanced User
                    Dashboards
                  </li>
                  <li className="flex items-center text-gray-800">
                    <span className="text-green-500 mr-2">✔</span> Email Alerts
                    when a Business registers as Sales Director
                  </li>
                  <li className="flex items-center text-gray-800">
                    <span className="text-green-500 mr-2">✔</span> Email Alerts
                    when a Business updates name
                  </li>
                </ul>
                <div className=" bottom-4 left-4 text-xl font-bold text-gray-800">
                  $19.95 a month
                </div>
                <button className=" mt-2 bottom-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded">
                  UPGRADE
                </button>
              </div>

              {/* Premium Listing */}
              <div className="border rounded-lg p-4 relative">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Premium Listing
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Upgrade your listing to a premium listing.
                </p>
                <ul className="list-none space-y-2">
                  <li className="flex items-center text-gray-800">
                    <span className="text-green-500 mr-2">✔</span> Business
                    Listing
                  </li>
                  <li className="flex items-center text-gray-800">
                    <span className="text-green-500 mr-2">✔</span> Photo
                  </li>
                  <li className="flex items-center text-gray-800">
                    <span className="text-green-500 mr-2">✔</span> Post Events
                  </li>
                  <li className="flex items-center text-gray-800">
                    <span className="text-green-500 mr-2">✔</span> Send and
                    receive email blasts
                  </li>
                  <li className="flex items-center text-gray-800">
                    <span className="text-green-500 mr-2">✔</span> Connect with
                    other Users
                  </li>
                  <li className="flex items-center text-gray-800">
                    <span className="text-green-500 mr-2">✔</span> Post Offers
                  </li>
                  <li className="flex items-center text-gray-800">
                    <span className="text-green-500 mr-2">✔</span> Appear in
                    search results
                  </li>
                  <li className="flex items-center text-gray-800">
                    <span className="text-green-500 mr-2">✔</span> Appear in
                    Featured Results
                  </li>
                  <li className="flex items-center text-gray-800">
                    <span className="text-green-500 mr-2">✔</span> Incentives
                    featured in Community dashboards
                  </li>
                  <li className="flex items-center text-gray-800">
                    <span className="text-green-500 mr-2">✔</span> Events
                    featured in Community dashboards
                  </li>
                  <li className="flex items-center text-gray-800">
                    <span className="text-green-500 mr-2">✔</span> Profile
                    picture in Community dashboards
                  </li>
                  <li className="flex items-center text-gray-800">
                    <span className="text-green-500 mr-2">✔</span> Enhanced
                    Business Profile
                  </li>
                  <li className="flex items-center text-gray-800">
                    <span className="text-green-500 mr-2">✔</span> Appear on the
                    Home Page (if limit is available)
                  </li>
                  <li className="flex items-center text-gray-800">
                    <span className="text-green-500 mr-2">✔</span> Enhanced User
                    Dashboards
                  </li>
                  <li className="flex items-center text-gray-800">
                    <span className="text-green-500 mr-2">✔</span> Email Alerts
                    when a Business registers as Sales Director
                  </li>
                  <li className="flex items-center text-gray-800">
                    <span className="text-green-500 mr-2">✔</span> Email Alerts
                    when a Business updates name
                  </li>
                </ul>
                <div className="  bottom-4 left-4 text-xl font-bold text-gray-800">
                  $29.95 a month
                </div>
                <button
                  className=" mt-2  bottom-4 right-4 bg-gray-400 text-white px-4 py-2 rounded"
                  disabled
                >
                  COMING SOON
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default page;
