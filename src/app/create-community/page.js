"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import CommunityType from "../community/Community-Type"; // Ensure the path is correct
import "react-toastify/dist/ReactToastify.css";
import Loding from "../../components/Loding";

export default function AgentFormInitial() {
  const [formData, setFormData] = useState({
    CommunityName: "",
    address: "",
    communityType: {
      "55+ Community": false,
      "Community Center for Seniors": false,
      "Group Home/Residential Care Home": false,
      "Independent Living/Senior Community": false,
      "Memory Care Community": false,
      "Skilled Nursing Facility/Nursing Home": false,
      "Assisted Living Community": false,
      "Continuing Care Retirement Community": false,
      Hospital: false,
      "Long-Term Care Acute Care Hospital": false,
      "Rehab License": false,
      "Transitional Care Hospital": false,
    },
  });

  const [isUpdating, setIsUpdating] = useState(false); // Flag to detect if the data is for update
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch existing data when the component mounts
  useEffect(() => {
    const fetchCommunityBusinessData = async () => {
      try {
        const response = await axios.get("/api/fetchCommunityBusinessData"); // Ensure the endpoint is correct
        const data = response.data.data;

        if (data) {
          // Update the form data with the fetched data and set to "isUpdating"
          setFormData({
            CommunityName: data.CommunityName || "",
            address: data.address || "",
            communityType: Object.keys(formData.communityType).reduce(
              (acc, type) => ({
                ...acc,
                [type]: data.communityType.includes(type),
              }),
              {}
            ),
          });
          setIsUpdating(true); // Set the flag to indicate this is an update
        }
      } catch (error) {
        console.error("Error fetching community business data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityBusinessData();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (name, checked) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      communityType: {
        ...prevFormData.communityType,
        [name]: checked,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.CommunityName || !formData.address) {
      toast.error("Please fill out all required fields.");
      return;
    }

    try {
      // Convert communityType to an array of selected options
      const selectedCommunityTypes = Object.keys(formData.communityType).filter(
        (type) => formData.communityType[type]
      );

      const submissionData = {
        CommunityName: formData.CommunityName,
        address: formData.address,
        communityType: selectedCommunityTypes,
      };

      let response;
      if (isUpdating) {
        // Update the existing community data
        response = await axios.put(
          "/api/fetchCommunityBusinessData",
          submissionData
        ); // Make sure the endpoint is correct
        toast.success("Data updated successfully!");
      } else {
        // Create new community data
        response = await axios.post("/api/communtyinfo", submissionData);
        toast.success("Data submitted successfully!");
      }

      // Navigate to the community listing page
      router.push("/community-listing");
    } catch (error) {
      console.error("Submission error:", error);
      const errorMsg =
        error.response?.data?.msg || "Unable to submit business data.";
      toast.error(errorMsg);
    }
  };

  if (loading) {
    return <Loding />; // Show loading state while data is being fetched
  }

  return (
    <>
      <ToastContainer />
      <div className="newslatter position-relative overflow-hidden">
        <div className="container p-4 mt-10 position-relative z-1">
          <div className="row">
            <div className="col-md-10 offset-md-1">
              <div className="text-center mb-5">
                <h2 className="h1 fw-semibold mb-3 text-black">
                  {isUpdating
                    ? "Update Your Community Information"
                    : "Let's Get Started!"}
                </h2>
                <div className="sub-title fs-16 text-black">
                  Please enter your Community name, address, and type
                </div>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="row justify-content-center">
              <div className="col-lg-10 col-xl-8">
                <div className="row g-4 align-items-end newslatter-form">
                  <div className="space-y-8">
                    <div className="form-group">
                      <label className="text-black bg-transparent fw-semibold">
                        Community Name
                      </label>
                      <input
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        name="CommunityName"
                        value={formData.CommunityName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="bg-transparent text-black fw-semibold">
                        Street address
                      </label>
                      <input
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <CommunityType
                    selectedOptions={formData.communityType}
                    handleCheckboxChange={handleCheckboxChange}
                  />
                  <div className="col-12 text-center">
                    <button
                      type="submit"
                      className="btn bg-gray-50 text-black btn-lg btn-light"
                    >
                      {isUpdating ? "Update" : "Submit"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
