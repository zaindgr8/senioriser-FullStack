"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "../Agent/Agent-sidebar";
import SectionHeader from "../../components/SectionHeader";

function Page() {
  const [receivedConnections, setReceivedConnections] = useState([]);
  const [sentConnections, setSentConnections] = useState([]);
  const [agents, setAgents] = useState([]);
  const [showEmptyMessage, setShowEmptyMessage] = useState(false);

  const updateConnectionStatus = async (connectionId, newStatus) => {
    try {
      const response = await axios.patch("/api/agent-connection", {
        connectionId,
        newStatus,
      });

      setReceivedConnections((prevConnections) =>
        prevConnections.map((connection) =>
          connection.id === connectionId
            ? { ...connection, status: newStatus }
            : connection
        )
      );
    } catch (error) {
      console.error("Error updating connection status:", error);
    }
  };

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get("/api/agentBusinessinfo");
        setAgents(response.data);
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };

    fetchAgents();
  }, []);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const receivedResponse = await axios.get("/api/agent-connection");
        const sentResponse = await axios.get("/api/sentconnections/");

        setReceivedConnections(receivedResponse.data);
        setSentConnections(
          Array.isArray(sentResponse.data) ? sentResponse.data : []
        );

        if (
          receivedResponse.data.length === 0 &&
          sentResponse.data.length === 0
        ) {
          setShowEmptyMessage(true);
        } else {
          setShowEmptyMessage(false);
        }
      } catch (error) {
        console.error("Error fetching connections:", error);
        setShowEmptyMessage(true); // Show message if there's an error
      }
    };

    fetchConnections();
  }, []);

  const getAgentBusinessName = (userauthId) => {
    const agent = agents.find((agent) => agent.userauthId === userauthId);
    return agent?.agentName || "N/A";
  };

  const getAgentFullName = (userauthId) => {
    const agent = agents.find((agent) => agent.userauthId === userauthId);
    return agent?.userauth?.fullName || "N/A";
  };

  return (
    <>
      <div className="flex flex-col md:mt-10 md:flex-row">
        <Sidebar />
        <div className="flex flex-col md:mx-10">
          <SectionHeader title="Dashboard">
            <p>Company Name: [Insert Company Name]</p>
          </SectionHeader>
          <div className="p-4 border-blue-500 rounded-lg border-2 pt-4 shadow-sm mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <>
              <div className="container">
                <div className="container j pb-2 pt-2">
                  <h2 className="text-xl font-semibold">
                    Received Connections
                  </h2>
                  <tr>
                    <td colSpan="5" className="text-center text-gray-500">
                      Looks like you need to make some connections.
                      <br />
                      <a href="#" className="text-blue-500">
                        Find Nearby Communities
                      </a>{" "}
                      |{" "}
                      <a href="#" className="text-blue-500">
                        Find Nearby Providers
                      </a>
                    </td>
                  </tr>
                </div>
                <div className="w-full">
                  <table className="bg-white">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-2 px-2 border-b border-gray-300">
                          Status
                        </th>
                        <th className="py-2 px-2 border-b border-gray-300">
                          Business Name
                        </th>
                        <th className="py-2 px-2 border-b border-gray-300">
                          Contact Name
                        </th>
                        <th className="py-2 px-2 border-b border-gray-300">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {receivedConnections.length > 0 ? (
                        receivedConnections.map((connection) => (
                          <tr key={connection.id}>
                            <td className="py-2 px-2 border-b border-gray-300">
                              {connection.status}
                            </td>
                            <td className="py-2 px-2 border-b border-gray-300">
                              {getAgentBusinessName(connection.senderId)}
                            </td>
                            <td className="py-2 px-2 border-b border-gray-300">
                              {getAgentFullName(connection.senderId)}
                            </td>
                            <td className="py-2 px-2 flex border-b border-gray-300">
                              <button
                                className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600"
                                onClick={() =>
                                  updateConnectionStatus(
                                    connection.id,
                                    "ACCEPTED"
                                  )
                                }
                              >
                                Approve
                              </button>
                              <button
                                className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 ml-2"
                                onClick={() =>
                                  updateConnectionStatus(
                                    connection.id,
                                    "DECLINED"
                                  )
                                }
                              >
                                Decline
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="5"
                            className="text-center py-4 text-gray-500"
                          >
                            No received connections found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="container p-2 mx-3">
                <div className="w-full">
                  <h2 className="text-xl font-semibold pb-2">
                    Sent Connections
                  </h2>
                  <table className="bg-white">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-2 px-4 border-b border-gray-300">
                          Status
                        </th>
                        <th className="py-2 px-4 border-b border-gray-300">
                          Business Name
                        </th>
                        <th className="py-2 px-4 border-b border-gray-300">
                          Contact Name
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sentConnections.length > 0 ? (
                        sentConnections.map((connection) => (
                          <tr key={connection.id}>
                            <td className="py-2 px-4 border-b border-gray-300">
                              {connection.status}
                            </td>
                            <td className="py-2 px-4 border-b border-gray-300">
                              {getAgentBusinessName(connection.receiverId)}
                            </td>
                            <td className="py-2 px-4 border-b border-gray-300">
                              {getAgentFullName(connection.receiverId)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="3"
                            className="text-center py-4 text-gray-500"
                          >
                            No sent connections found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
