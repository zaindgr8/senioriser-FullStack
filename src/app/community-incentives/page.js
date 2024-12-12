"use client";
import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../community/Community-Sidebar";
import Incentives from "../community/Incentives";

import SectionHeader from "../../components/SectionHeader";
const Page = () => {
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
          <Incentives />
        </div>
      </div>
    </>
  );
};

export default Page;
