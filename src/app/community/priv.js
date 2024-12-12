"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Loding from "../../components/Loding";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
const AgentDetails = ({ agentId, userauthId }) => {
  const [agent, setAgent] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [acceptedConnectionsCount, setAcceptedConnectionsCount] = useState(0);
  const [acceptedSponsorCount, setAcceptedSponsorCount] = useState(0);
  const [acceptedSponsorNames, setAcceptedSponsorNames] = useState([]);
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false); // Modal State
  const [agreedToTerms, setAgreedToTerms] = useState(false); // Checkbox State
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  const toggleInfoVisibility = () => {
    setIsInfoVisible(!isInfoVisible); // Toggle visibility
  };
  // Fetch logged-in user's ID from cookies
  useEffect(() => {
    const fetchLoggedInUserId = async () => {
      try {
        const response = await axios.get("/api/getcookes");
        if (response.data?.user?.id) {
          setLoggedInUserId(response.data.user.id);
        }
      } catch (error) {
        console.error("Error fetching logged-in user ID:", error);
      }
    };

    fetchLoggedInUserId();
  }, []);

  // Fetch agent details
  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const response = await axios.get(
          `/api/agentBusinessinfo/${agentId}/${userauthId}`
        );
        setAgent(response.data.data);
      } catch (error) {
        console.error("Error fetching agent:", error);
      }
    };

    fetchAgent();
  }, [agentId, userauthId]);

  // Fetch accepted connections count for the agent's profile
  useEffect(() => {
    const fetchAcceptedConnections = async () => {
      try {
        const response = await axios.get("/api/accepted-connections", {
          params: { userauthId },
        });
        setAcceptedConnectionsCount(response.data.count);
      } catch (error) {
        console.error("Error fetching accepted connections:", error);
      }
    };

    if (userauthId) {
      fetchAcceptedConnections();
    }
  }, [userauthId]);

  // Fetch accepted sponsors for the agent's profile
  useEffect(() => {
    const fetchAcceptedSponsors = async () => {
      try {
        const response = await axios.get("/api/accepted-sponsors", {
          params: { userauthId },
        });
        setAcceptedSponsorCount(response.data.count);
        setAcceptedSponsorNames(response.data.sponsors);
      } catch (error) {
        console.error("Error fetching accepted sponsors:", error);
      }
    };

    if (userauthId) {
      fetchAcceptedSponsors();
    }
  }, [userauthId]);

  // Prevent user from sending requests to themselves
  const handleSelfRequestCheck = (actionType) => {
    if (loggedInUserId === agent?.userauthId) {
      toast.error(`You cannot send a ${actionType} request to yourself.`);
      return true;
    }
    return false;
  };

  // Handle connection request
  const handleConnectionRequest = async (receiverId) => {
    if (handleSelfRequestCheck("connection")) return;

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
    <>
      <ToastContainer />
      <div className="mt-12 mx-16 p-2 w-40 rounded-lg ">
        <Link href={"/agent-list"} className="text-white btn btn-primary">
          {" "}
          Back to Search
        </Link>
      </div>
      <div className="container  ">
        {agent ? (
          <div className="flex">
            {/* Left Column: Details Section */}
            <div className="flex flex-col  p-4">
              <h2 className="text-2xl font-bold mb-4">{agent.agentName}</h2>

              {/* Display Agent Image */}
              {agent.agentBusiness[0]?.image ? (
                <div className="w-[90%] border-1 border-black  h-[50%] bg-gray-200 overflow-hidden rounded-lg mb-4">
                  <img
                    src={agent.agentBusiness[0].image}
                    alt="Agent Business"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-[90%] border-1 border-black h-[50%] bg-gray-200 overflow-hidden rounded-lg mb-4">
                  <img
                    src={"/assets/my_imgs/agent.jpg"}
                    alt="Agent Business"
                    className="w-full h-full p-0.5 object-cover"
                  />
                </div>
              )}

              {/* About Section */}
              <h2 className="text-xl font-semibold mb-2">About</h2>
              <p className="text-gray-700 mb-6">
                {agent.agentBusiness[0]?.companyOverview ||
                  "Company Overview Not Available"}
              </p>

              {/* More Information Section */}
              <h2 className="text-xl font-semibold mb-2">More Information</h2>
              {loggedInUserId && (
                <>
                  <p>
                    <strong>Address: </strong>
                    {agent.address}
                  </p>
                  <p>
                    <strong>City:</strong> {agent.agentBusiness[0]?.city}
                  </p>

                  <p>
                    <strong>State:</strong> {agent.agentBusiness[0]?.state}
                  </p>
                  <p>
                    <strong>Zip:</strong> {agent.agentBusiness[0]?.zip}
                  </p>
                  <p>
                    <strong> Phone: </strong>
                    {agent.agentBusiness[0]?.primaryPhone}
                  </p>
                  <p>
                    <strong>Fax: </strong>
                    {agent.agentBusiness[0]?.fax}
                  </p>
                  <p>
                    <strong> Cell Phone: </strong>
                    {agent.agentBusiness[0]?.cellPhone}
                  </p>
                  <p>
                    <strong>Business Type: </strong>
                    {agent.businessType}
                  </p>
                </>
              )}
              <p>
                <strong>Specializes In: </strong>
                {agent.services?.length > 0
                  ? agent.services.join(", ")
                  : "Not Available"}
              </p>
            </div>

            {/* Right Column: Actions Section */}
            <div className="flex flex-col mt-20 ">
              {agent.agentBusiness[0]?.image && (
                <div className="w-40 h-32 mb-2   border-1 border-black rounded-lg">
                  <img
                    src={agent.agentBusiness[0].image}
                    alt="Business Small Image"
                    className="rounded-md w-40 h-32 p-1 object-cover"
                  />
                </div>
              )}

              {/* Display Profile Photo if exists */}
              {agent.userauth.UserProfile[0]?.profilePhoto ? (
                <div className="w-28 h-28 mb-2  ml-10  rounded-3xl">
                  <img
                    src={agent.userauth.UserProfile[0].profilePhoto}
                    alt="Profile Photo"
                    className="rounded-md w-40 h-32 p-1 object-cover"
                  />
                </div>
              ) : (
                <img
                  src={"/assets/my_imgs/humanimage.png"}
                  alt="Profile Photo"
                  className="rounded-full w-28 ml-10 h-28 object-cover"
                />
              )}
              {loggedInUserId ? (
                <>
                  {/* User Name */}
                  <h2
                    className="font-bold text-lg mt-1 flex items-center justify-center text-blue-500 cursor-pointer"
                    onClick={toggleInfoVisibility}
                  >
                    {agent?.userauth?.fullName || userName}
                  </h2>
                </>
              ) : (
                <>
                  {/* Link to Sign In or Create Account */}
                  <h2 className="font-bold text-lg mt-4 flex items-center justify-center text-blue-500 cursor-pointer">
                    <Link href="/signin" className="cursor-pointer">
                      Create Account / Sign In
                    </Link>
                  </h2>
                </>
              )}
              <p className="text-md flex items-center justify-center text-blue-500 cursor-pointer ">
                {agent.userauth.UserProfile?.[0]?.jobTitle}
              </p>
              {isInfoVisible && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white shadow-md rounded-lg p-6 w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] max-w-lg max-h-[80vh] overflow-auto relative">
                    {/* Close Button */}
                    <button
                      onClick={() => setIsInfoVisible(false)}
                      className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                    >
                      &times; {/* This is the "X" symbol for closing */}
                    </button>

                    {/* Modal Content */}
                    {agent.userauth.UserProfile[0]?.jobTitle && (
                      <p className="text-gray-700 mb-2">
                        <strong>Job Title:</strong>{" "}
                        {agent.userauth.UserProfile[0].jobTitle}
                      </p>
                    )}
                    {agent.userauth.UserProfile[0]?.startedInIndustry && (
                      <p className="text-gray-700 mb-2">
                        <strong>Started in Industry:</strong>{" "}
                        {new Date(
                          agent.userauth.UserProfile[0].startedInIndustry
                        ).toLocaleDateString()}
                      </p>
                    )}
                    {agent.userauth.UserProfile[0]?.aboutYou && (
                      <p className="text-gray-700 mb-2">
                        <strong>About You:</strong>{" "}
                        {agent.userauth.UserProfile[0].aboutYou}
                      </p>
                    )}
                    {agent.userauth.UserProfile[0]?.education && (
                      <p className="text-gray-700 mb-2">
                        <strong>Education:</strong>{" "}
                        {agent.userauth.UserProfile[0].education}
                      </p>
                    )}
                    {agent.userauth.UserProfile[0]?.certificatesAndAwards
                      ?.length > 0 && (
                      <div className="text-gray-700 mb-2">
                        <strong>Certificates and Awards:</strong>
                        <div className="flex flex-wrap gap-4 mt-2">
                          {agent.userauth.UserProfile[0].certificatesAndAwards.map(
                            (award, index) => (
                              <div
                                key={index}
                                className="w-24 h-24 overflow-hidden rounded-lg bg-gray-200"
                              >
                                <img
                                  src={award} // Assuming 'award' is the image URL
                                  alt={`Certificate or Award ${index + 1}`}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* Sponsor Button */}
              <div className="space-y-2 mt-2 w-52">
                <button
                  className="w-full hover:bg-yellow-500 bg-gray-200 text-gray-700 py-2 rounded"
                  onClick={() => handleConnectionRequest(agent.userauthId)}
                >
                  <span className="mr-2">💼</span> Connection :{" "}
                  {acceptedConnectionsCount}
                </button>

                {/* Share Button */}
                <button className="w-full hover:bg-yellow-500 bg-gray-200 text-gray-700 py-2 rounded">
                  <span className="mr-2">🔗</span> Share
                </button>

                {/* Visit Website Button */}
                <button className="w-full hover:bg-yellow-500 bg-gray-200 text-gray-700 py-2 rounded">
                  <span className="mr-2">
                    <Link
                      href={`https://${
                        new URL(
                          agent.agentBusiness[0]?.website.startsWith("http")
                            ? agent.agentBusiness[0]?.website
                            : "https://" + agent.agentBusiness[0]?.website
                        ).hostname
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      🌐
                    </Link>
                  </span>
                  Visit Website
                </button>
              </div>
              <div className="flex justify-center max-h-screen mt-4 space-x-4">
                {/* Facebook Icon */}

                <Link
                  href={agent.agentBusiness[0]?.link1 || ""}
                  target="_blank"
                >
                  <FaFacebook className="text-blue-600 hover:text-blue-800 w-6 h-6" />
                </Link>

                {/* Instagram Icon */}

                <Link
                  href={agent.agentBusiness[0]?.link2 || ""}
                  target="_blank"
                >
                  <FaInstagram className="text-pink-600 hover:text-pink-800 w-6 h-6" />
                </Link>

                <Link
                  href={agent.agentBusiness[0]?.link3 || ""}
                  target="_blank"
                >
                  <FaLinkedin className="text-blue-700 hover:text-blue-900 w-6 h-6" />
                </Link>

                {/* YouTube Icon */}

                <Link
                  href={agent.agentBusiness[0]?.link4 || ""}
                  target="_blank"
                >
                  <FaYoutube className="text-red-600 hover:text-red-800 w-6 h-6" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <Loding />
        )}
      </div>
    </>
  );
};

export default AgentDetails;
