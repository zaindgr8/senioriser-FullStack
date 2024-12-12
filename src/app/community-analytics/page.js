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
          <div className="p-4 border-blue-500 rounded-lg border-2 pt-4 shadow-sm mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">
                  Total times your listing appeared in search results:
                </span>
                <span className="text-gray-900 font-semibold">0</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">
                  Total times your listing was viewed:
                </span>
                <span className="text-gray-900 font-semibold">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">
                  Total times your listing was shared:
                </span>
                <span className="text-gray-900 font-semibold">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default page;
