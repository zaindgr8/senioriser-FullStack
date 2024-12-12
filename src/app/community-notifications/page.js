"use client";
import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../community/Community-Sidebar";

import SectionHeader from "../../components/SectionHeader";
function page() {
  const [activeTab, setActiveTab] = useState("messages");
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
          <div className="p-4 border-blue-500 rounded-lg border-2 pt-4 shadow-sm mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="container mx-auto p-4">
              <div className="flex space-x-4 mb-4">
                <button
                  className={`px-4 py-2 ${
                    activeTab === "messages"
                      ? "text-blue-500 border-b-2 border-blue-500"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("messages")}
                >
                  MESSAGES
                </button>
                <button
                  className={`px-4 py-2 ${
                    activeTab === "alerts"
                      ? "text-blue-500 border-b-2 border-blue-500"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("alerts")}
                >
                  ALERTS
                </button>
              </div>

              {activeTab === "messages" && (
                <div>
                  <div className="flex items-center mb-4">
                    <input type="checkbox" className="mr-2" />
                    <span>Select All</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="py-2 px-4 border-b border-gray-300">
                            FROM
                          </th>
                          <th className="py-2 px-4 border-b border-gray-300">
                            SUBJECT
                          </th>
                          <th className="py-2 px-4 border-b border-gray-300">
                            DATE
                          </th>
                          <th className="py-2 px-4 border-b border-gray-300">
                            TIME
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td
                            colSpan="4"
                            className="text-center py-4 text-gray-500"
                          >
                            No data available.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "alerts" && (
                <div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="py-2 px-4 border-b border-gray-300">
                            DATE
                          </th>
                          <th className="py-2 px-4 border-b border-gray-300">
                            TYPE
                          </th>
                          <th className="py-2 px-4 border-b border-gray-300">
                            TITLE
                          </th>
                          <th className="py-2 px-4 border-b border-gray-300">
                            ACTION
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td
                            colSpan="4"
                            className="text-center py-4 text-gray-500"
                          >
                            No notifications found.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default page;
