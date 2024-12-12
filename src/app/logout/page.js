"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Ensure toast notifications are styled

function ProfilePage() {
  const [userData, setUserData] = useState(null); // State to store user data
  const [loading, setLoading] = useState(true); // State to manage loading
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/getcookes"); // Call the API you created
        setUserData(response.data.user); // Store the user data
        setLoading(false); // Stop loading when data is fetched
      } catch (error) {
        toast.error("Failed to fetch user data");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("/api/logout");
      toast.success("Logged out successfully");

      window.location.href = "signin";
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("An error occurred during logout");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg w-full sm:max-w-lg p-6">
        <div className="flex flex-col items-center">
          <img
            className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg"
            src={userData?.profilePhoto || "https://via.placeholder.com/150"} // Profile Image
            alt="Profile Picture"
          />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
            {userData?.fullName || "John Doe"} {/* Full Name */}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {userData?.email || "john.doe@example.com"} {/* Email */}
          </p>
          <hr className="w-full my-4 border-gray-300 dark:border-gray-700" />
        </div>

        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Profile Page
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400">
            Welcome to your profile page. Here you can manage your personal
            information, view activity, and log out.
          </p>
          <button
            className="w-full sm:w-auto px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
