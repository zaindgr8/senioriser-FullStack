"use client";
import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "../Agent/Agent-sidebar";
import SectionHeader from "../../components/SectionHeader";
import Button from "../../components/Button";
import Communitylisting from "../Agent/agent-Listing";
import InsuranceOptions from "../Agent/InsuranceOptions";
import PaymentOptions from "../Agent/PaymentOptions";
import ImagesUpload from "../Agent/Uplode-Image";
import Link from "next/link";
const Page = () => {
  const [activeTab, setActiveTab] = useState("GENERAL");

  const renderContent = () => {
    switch (activeTab) {
      case "GENERAL":
        return <Communitylisting />;

      case "PHOTOS":
        return (
          <div>
            <ImagesUpload />
          </div>
        );
      case "PAYMENT ACCEPT":
        return (
          <div>
            <PaymentOptions />
          </div>
        );

      case "INSURANCE ACCEPT":
        return (
          <div>
            <InsuranceOptions />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className=" flex  md:mt-12 md:mx-2">
        <Link
          href={"/create-agent"}
          className=" bg-blue-700 font-bold p-2 rounded-lg text-white"
        >
          Back to Business Data Edit
        </Link>
      </div>
      <div className="flex flex-col md:mt-2 md:flex-row">
        <Sidebar />
        <div className="flex flex-col md:mx-10">
          <SectionHeader title="Dashboard"></SectionHeader>
          <div className="flex space-x-6 m-2 p-2 bg-gray-100 rounded-md shadow-sm">
            <Button
              isActive={activeTab === "GENERAL"}
              onClick={() => setActiveTab("GENERAL")}
            >
              GENERAL
            </Button>

            <Button
              isActive={activeTab === "PHOTOS"}
              onClick={() => setActiveTab("PHOTOS")}
            >
              PHOTOS
            </Button>
            <Button
              isActive={activeTab === "PAYMENT ACCEPT"}
              onClick={() => setActiveTab("PAYMENT ACCEPT")}
            >
              PAYMENT ACCEPT
            </Button>

            <Button
              isActive={activeTab === "INSURANCE ACCEPT"}
              onClick={() => setActiveTab("INSURANCE ACCEPT")}
            >
              INSURANCE ACCEPT
            </Button>
          </div>
          <div className="mt-4">{renderContent()}</div>
        </div>
      </div>
    </>
  );
};

export default Page;
