import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function CommunityType() {
  const [communityOptions, setCommunityOptions] = useState({
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
  });

  // Fetch community types from the database on component mount
  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        const response = await axios.get("/api/getcommunityid"); // Ensure the endpoint is correct
        const fetchedData = response.data;

        const updatedOptions = { ...communityOptions };
        fetchedData.data.forEach((item) => {
          // Note the .data here
          if (item.communityType) {
            item.communityType.forEach((type) => {
              if (updatedOptions.hasOwnProperty(type)) {
                updatedOptions[type] = true;
              }
            });
          }
        });
        setCommunityOptions(updatedOptions);
      } catch (error) {
        toast.error("Failed to fetch community types");
        console.error(error);
      }
    };

    fetchCommunityData();
  }, []);

  const firstColumnOptions = Object.keys(communityOptions).slice(0, 6);
  const secondColumnOptions = Object.keys(communityOptions).slice(6);

  return (
    <div className="p-6 bg-gray-50 rounded-lg border border-gray-300">
      <h2 className="text-xl text-center font-semibold mb-4">
        Select Community Type
      </h2>
      <form>
        <div className="grid grid-cols-2 gap-4">
          <div>
            {firstColumnOptions.map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={option}
                  className="form-checkbox h-5 w-5 text-blue-600"
                  checked={communityOptions[option]}
                  readOnly
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
          <div>
            {secondColumnOptions.map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={option}
                  className="form-checkbox h-5 w-5 text-blue-600"
                  checked={communityOptions[option]}
                  readOnly
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}

export default CommunityType;
