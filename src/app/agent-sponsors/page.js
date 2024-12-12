"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Agent/Agent-sidebar";
import SectionHeader from "../../components/SectionHeader";

function ProfilePage() {
  const [sentSponsors, setSentSponsors] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("annual");
  const [showPlanSelection, setShowPlanSelection] = useState(false);
  const [activeSponsorId, setActiveSponsorId] = useState(null);

  const monthlyRate = 85;
  const annualRate = 780;
  const monthlyTotal = monthlyRate * 12;
  const annualDiscount = monthlyTotal - annualRate;
  const annualDiscountPercentage = (
    (annualDiscount / monthlyTotal) *
    100
  ).toFixed(2);

  useEffect(() => {
    const fetchSentSponsors = async () => {
      try {
        const response = await axios.get("/api/getsponsor");
        setSentSponsors(response.data.sponsorConnections);
      } catch (error) {
        console.error("Failed to fetch sent sponsors", error);
        alert("Failed to fetch sponsorship data. Please try again.");
      }
    };

    fetchSentSponsors();
  }, []);

  const handleAcceptClick = (sponsorId) => {
    setActiveSponsorId(sponsorId);
    setShowPlanSelection(true);
  };

  const handlePlanSelection = async () => {
    try {
      const { data } = await axios.post("/api/create-checkout", {
        sponsorshipId: activeSponsorId,
        planType: selectedPlan,
        isAutoRenewal: true,
      });

      window.location.href = data.url;
    } catch (error) {
      console.error("Error creating payment session:", error);
      alert("Error initiating payment process. Please try again.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 p-6">
        <SectionHeader title="My Sent Sponsorships" />
        <div className="mt-6 bg-white border-blue-500 rounded-lg border-2 shadow-md overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium leading-6 text-gray-900">
              My Sponsors
            </h2>
          </div>
          <div className="border-t border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Communities
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sentSponsors.length > 0 ? (
                  sentSponsors.map((sponsor) => (
                    <tr key={sponsor.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {sponsor.receiver.communityBusinessinfos.length > 0 && (
                          <p className="text-gray-600">
                            {
                              sponsor.receiver.communityBusinessinfos[0]
                                .CommunityName
                            }
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sponsor.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {sponsor.status === "APPROVED" ? (
                          <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => handleAcceptClick(sponsor.id)}
                          >
                            Complete Sponsorship
                          </button>
                        ) : sponsor.status === "SPONSORED" ? (
                          <span className="text-gray-500">Completed</span>
                        ) : null}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                    >
                      No sponsorship requests sent yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showPlanSelection && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 overflow-y-auto h-full w-full"
          id="my-modal"
        >
          <div className="relative top-20 mx-auto  p-5 border w-[500px] shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Choose a Sponsorship Plan
              </h3>
              <div className="mt-2 px-7 py-3">
                <div className="flex items-center mb-4">
                  <input
                    id="annual"
                    type="radio"
                    name="plan"
                    value="annual"
                    checked={selectedPlan === "annual"}
                    onChange={() => setSelectedPlan("annual")}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="annual"
                    className="ml-2 text-sm font-medium text-gray-900"
                  >
                    Annual Plan
                    <p className="text-xs text-gray-600">
                      ${annualRate}/year (Save ${annualDiscount})
                    </p>
                    <p className="text-xs text-green-600 font-semibold">
                      {annualDiscountPercentage}% discount
                    </p>
                  </label>
                </div>
                <div className="flex items-center mb-4">
                  <input
                    id="monthly"
                    type="radio"
                    name="plan"
                    value="monthly"
                    checked={selectedPlan === "monthly"}
                    onChange={() => setSelectedPlan("monthly")}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="monthly"
                    className="ml-2 text-sm font-medium text-gray-900"
                  >
                    Monthly Plan
                    <p className="text-xs text-gray-600">
                      $85/month, $255 upfront for first 3 months
                    </p>
                    <p className="text-xs text-gray-600">
                      Total per year: ${monthlyTotal}
                    </p>
                  </label>
                </div>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  id="ok-btn"
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  onClick={handlePlanSelection}
                >
                  Proceed to Payment
                </button>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  id="cancel-btn"
                  className="px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  onClick={() => setShowPlanSelection(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
