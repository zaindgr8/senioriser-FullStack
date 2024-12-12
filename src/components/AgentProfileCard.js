"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../components/Loding"; // Adjust the import path as needed

export default function AgentProfileCard() {
  const [profiles, setProfiles] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  useEffect(() => {
    const fetchAgentsAndProfiles = async () => {
      try {
        setLoading(true); // Start loading
        const [agentsResponse, profilesResponse] = await Promise.all([
          axios.get("/api/getagent"),
          axios.get("/api/userProfile"),
        ]);

        setAgents(
          Array.isArray(agentsResponse.data)
            ? agentsResponse.data.slice(0, 4) // Limit to first 4 agents
            : []
        );
        setProfiles(
          Array.isArray(profilesResponse.data?.data)
            ? profilesResponse.data.data.slice(0, 4) // Limit to first 4 profiles
            : []
        );
      } catch (error) {
        console.error("Error fetching agents and profiles:", error);
        setError("Failed to fetch agents and profiles");
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchAgentsAndProfiles();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="text-center">
        <p>No Providers found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap justify-between gap-4">
        {agents.map((agent) => {
          const profile = profiles.find((p) => p.id === agent.userauthId);

          return (
            <div
              key={agent.id}
              className="p-4 border rounded-lg shadow-md flex-grow flex flex-col items-center"
            >
              {/* Link the entire card to the agent detail page */}
              <Link
                href={`/agent-detail/${agent.id}`}
                className="w-full h-full"
              >
                <div className="text-center w-full h-full">
                  <div className="avatar rounded-circle p-1 border border-primary">
                    <img
                      src={
                        profile?.UserProfile[0]?.profilePhoto ||
                        "/assets/my_imgs/agent.jpg"
                      }
                      alt={profile?.fullName || agent.agentName}
                      className="avatar-img rounded-circle"
                    />
                    <div className="align-items-center avatar-badge bg-primary d-flex justify-content-center position-absolute rounded-circle text-white">
                      <i className="fas fa-medal" />
                    </div>
                  </div>
                  <h5 className="mt-3 mb-1">{agent.agentName}</h5>
                  <div>
                    {agent.businessType || "Business type not available"}
                  </div>
                  <p className="text-sm text-gray-500">
                    Services: {agent.services.join(", ")}
                  </p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
