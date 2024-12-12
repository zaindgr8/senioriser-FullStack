"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../community/Community-Sidebar";
import SectionHeader from "../../components/SectionHeader";

function ProfilePage() {
  const [receivedSponsors, setReceivedSponsors] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        // Fetch the current logged-in user
        const currentUserResponse = await axios.get("/api/getcookes");
        setCurrentUser(currentUserResponse.data.user);

        // Fetch the sponsor requests
        const response = await axios.get("/api/sponsorrequest");
        const received = response.data.sponsorConnections.filter(
          (sponsor) => sponsor.receiverId === currentUserResponse.data.user.id
        );
        setReceivedSponsors(received);
      } catch (error) {
        console.error("Failed to fetch sponsors", error);
      }
    };

    fetchSponsors();
  }, []);

  // Handle Accept button click
  const handleAcceptClick = async (sponsorId) => {
    try {
      // Call the PUT API to update the status to "APPROVED"
      await axios.put("/api/sponsorrequest", {
        sponsorshipId: sponsorId,
        status: "APPROVED",
      });

      // Update UI after successful response
      setReceivedSponsors((prevSponsors) =>
        prevSponsors.map((sponsor) =>
          sponsor.id === sponsorId
            ? { ...sponsor, status: "APPROVED" }
            : sponsor
        )
      );
      alert("Sponsorship request APPROVED successfully.");
    } catch (error) {
      console.error("Error accepting sponsorship request:", error);
      alert("Failed to accept the sponsorship request.");
    }
  };

  // Handle Cancel button click
  const handleCancelClick = async (sponsorId) => {
    try {
      // Call the DELETE API to remove the sponsor request
      await axios.delete(`/api/sponsorrequest?id=${sponsorId}`);

      // Remove the declined sponsor from the UI
      setReceivedSponsors((prevSponsors) =>
        prevSponsors.filter((sponsor) => sponsor.id !== sponsorId)
      );
      alert("Sponsorship request declined successfully.");
    } catch (error) {
      console.error("Error declining sponsorship request:", error);
      alert("Failed to decline the sponsorship request.");
    }
  };

  return (
    <div className="flex flex-col md:mt-10 md:flex-row">
      <Sidebar />
      <div className="flex flex-col md:mx-10">
        <SectionHeader title="Dashboard" />
        <div className="p-4 border-blue-500 rounded-lg border-2 pt-4 shadow-sm mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="container mx-auto p-4">
            <h2 className="text-xl font-semibold mb-4">My sponsors</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-300">
                      Business Name
                    </th>
                    <th className="py-2 px-4 border-b border-gray-300">
                      Status
                    </th>
                    <th className="py-2 px-4 border-b border-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {receivedSponsors.length > 0 ? (
                    receivedSponsors.map((sponsor) => (
                      <tr key={sponsor.id}>
                        <td className="py-2 px-4 border-b border-gray-300">
                          {sponsor.sponsor.fullName}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-300">
                          {sponsor.status}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-300">
                          {sponsor.status === "PENDING" ? (
                            <>
                              <button
                                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                                onClick={() => handleAcceptClick(sponsor.id)}
                              >
                                Approve
                              </button>
                              <button
                                className="bg-red-500 text-white px-4 py-2 rounded"
                                onClick={() => handleCancelClick(sponsor.id)}
                              >
                                Cancel
                              </button>
                            </>
                          ) : sponsor.status === "APPROVED" ? (
                            <span className="text-gray-500">
                              Request APPROVED
                            </span>
                          ) : null}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center py-4 px-4 border-b border-gray-300 text-gray-500"
                      >
                        No sponsors received yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
