"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const page = () => {
  const [agents, setAgents] = useState([]);
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  useEffect(() => {
    // Fetch the logged-in user's ID
    const fetchLoggedInUserId = async () => {
      try {
        const response = await axios.get("/api/getcookes"); // Replace with your GET endpoint
        setLoggedInUserId(response.data.user.id);
      } catch (error) {
        console.error("Error fetching logged-in user ID:", error);
      }
    };

    fetchLoggedInUserId();
  }, []);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get("/api/agentBusinessinfo");
        setAgents(response.data);
      } catch (error) {
        console.error("Error fetching Providers :", error);
      }
    };

    fetchAgents();
  }, []);

  const handleConnectionRequest = async (receiverId) => {
    if (!loggedInUserId) {
      // If user is not logged in, show an alert message
      alert("Please create an account to send a connection request.");
      return;
    }

    try {
      const response = await axios.post("/api/agent-connection", {
        receiverId,
        status: "PENDING",
      });

      if (response.status === 201) {
        toast.success("Connection request sent successfully!");
      } else {
        toast.error("Failed to send connection request.");
      }
    } catch (error) {
      console.error("Error sending connection request:", error);
      toast.error("Failed to send connection request.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Providers List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="p-4 border rounded-lg shadow-md bg-white"
          >
            <h2 className="text-xl font-semibold">{agent.agentName}</h2>
            <p className="text-gray-600">{agent.address}</p>
            <p className="text-sm text-gray-500">
              {agent.businessType} | Services: {agent.services.join(", ")}
            </p>
            <div className="mt-4 flex justify-center">
              {loggedInUserId && agent.userauthId !== loggedInUserId ? (
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
                  onClick={() => handleConnectionRequest(agent.userauthId)}
                >
                  Send Connection Request
                </button>
              ) : (
                !loggedInUserId && (
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md"
                    onClick={() =>
                      alert(
                        "Please create an account to send a connection request."
                      )
                    }
                  >
                    Send Connection Request
                  </button>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
