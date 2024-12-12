import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function InsuranceOptions() {
  const [insuranceOptions, setInsuranceOptions] = useState({
    allInsurance: false,
    dentalInsurance: false,
    longTermInsurance: false,
    medicaid: false,
    medicaidManaged: false,
    medicare: false,
    supplemental: false,
    visionInsurance: false,
    workersComp: false,
  });

  const [agentbusinessInfoId, setAgentbusinessInfoId] = useState(null);

  // Fetch the latest AgentBusinessinfo ID and existing insurance options
  useEffect(() => {
    const fetchLatestEntry = async () => {
      try {
        // Fetch the latest AgentBusinessinfo ID
        const response = await axios.get("/api/agentBusinessinfo");
        const latestEntry = response.data[response.data.length - 1];

        if (latestEntry && latestEntry.id) {
          setAgentbusinessInfoId(latestEntry.id);
          // Fetch the existing insurance options if any
          fetchInsuranceOptions(latestEntry.id);
        } else {
          toast.error("Failed to fetch the latest agent business info ID.");
        }
      } catch (error) {
        console.error("Fetching error:", error);
        toast.error("Failed to fetch agent business info ID.");
      }
    };

    const fetchInsuranceOptions = async (id) => {
      try {
        const response = await axios.get(
          `/api/insuranceOptions?agentbusinessInfoId=${id}`
        );
        if (response.data) {
          setInsuranceOptions(response.data);
        }
      } catch (error) {
        console.error("Fetching error:", error);
        toast.error("Failed to fetch insurance options.");
      }
    };

    fetchLatestEntry();
  }, []);

  const handleToggle = (option) => {
    setInsuranceOptions((prevState) => ({
      ...prevState,
      [option]: !prevState[option],
    }));
  };

  const handleSave = async () => {
    try {
      if (agentbusinessInfoId) {
        if (insuranceOptions.id) {
          // Update existing insurance options
          await axios.put(`/api/insuranceOptions/${insuranceOptions.id}`, {
            ...insuranceOptions,
            agentbusinessInfoId,
          });
        } else {
          // Create new insurance options
          await axios.post("/api/insuranceOptions", {
            ...insuranceOptions,
            agentbusinessInfoId,
          });
        }
        toast.success("Insurance options saved successfully!");
      } else {
        toast.error("Agent business info ID is missing.");
      }
    } catch (error) {
      console.error("Error saving insurance options:", error);
      toast.error("Failed to save insurance options.");
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1>Manage Insurance Options</h1>
      <div className="h-full border-blue-500 rounded-lg border-2 pt-4 shadow-sm w-full mt-2">
        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto p-4">
          {/* Left Column */}
          <div className="space-y-4">
            {[
              { id: "allInsurance", label: "All Insurance" },
              { id: "dentalInsurance", label: "Dental Insurance" },
              { id: "longTermInsurance", label: "Long Term Insurance" },
              { id: "medicaid", label: "Medicaid" },
              { id: "medicaidManaged", label: "Medicaid Managed" },
            ].map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id={option.id}
                      checked={insuranceOptions[option.id]}
                      onChange={() => handleToggle(option.id)}
                      className="sr-only"
                    />
                    <div className="block bg-gray-300 w-14 h-8 rounded-full"></div>
                    <div
                      className={`dot absolute left-1 top-1 w-6 h-6 rounded-full transition ${
                        insuranceOptions[option.id]
                          ? "transform translate-x-6 bg-green-500"
                          : "bg-white"
                      }`}
                    ></div>
                  </div>
                  <span className="ml-3 text-gray-700">{option.label}</span>
                </label>
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {[
              { id: "medicare", label: "Medicare" },
              { id: "supplemental", label: "Supplemental" },
              { id: "visionInsurance", label: "Vision Insurance" },
              { id: "workersComp", label: "Workers Comp" },
            ].map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id={option.id}
                      checked={insuranceOptions[option.id]}
                      onChange={() => handleToggle(option.id)}
                      className="sr-only"
                    />
                    <div className="block bg-gray-300 w-14 h-8 rounded-full"></div>
                    <div
                      className={`dot absolute left-1 top-1 w-6 h-6 rounded-full transition ${
                        insuranceOptions[option.id]
                          ? "transform translate-x-6 bg-green-500"
                          : "bg-white"
                      }`}
                    ></div>
                  </div>
                  <span className="ml-3 text-gray-700">{option.label}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button
        onClick={handleSave}
        className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
      >
        Save
      </button>
    </div>
  );
}
