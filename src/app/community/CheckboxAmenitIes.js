import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Checkbox from "../../components/Checkbox";

const amenities1 = [
  "24 Hour On-site Certified Licensed Staff",
  "24 Hour On-Site Staff",
  "3 Nutritious Meals a day",
  "Alarmed Interior",
  "Arts & Crafts Center",
  "Barber Shop",
  "Bariatric Care",
  "Basic Cable Available",
  "Basic Cable Included",
  "Beauty Salon",
  "Billiard Lounge",
  "Church Services",
  "Companion Rooms",
  "Computer Labs",
  "Courtyard",
  "Daily Activities",
  "Dining (Optional)",
  "Elevator",
  "Utilities Included (All)",
  "Utilities Included (Most)",
  "Walk-in Showers",
  "Walk-in Tubs",
];

const amenities2 = [
  "Emergency Call System",
  "Emergency Pendant",
  "Exercise Room",
  "Extended Congregate Care License",
  "Fireplace (Community)",
  "Furnished Units",
  "Game Room",
  "Handrails",
  "Health and Nutrition Classes",
  "Housekeeping",
  "Incontinence Care",
  "Individual Climate Control",
  "Insulin Injection Assistance",
  "Library",
  "Local Phone Service",
  "Located Near Hospital",
  "Maintenance",
  "Meals Served Daily",
  "Mechanical Soft Diet",
  "Medical Management",
  "Transportation to Appointment",
  "Tube Feeding (Assisted)",
];

const amenities3 = [
  "Medication Assistance",
  "On-Site Physical Therapy",
  "On-Site Physician Visit",
  "One Story Community",
  "One Story Community Option",
  "Outdoor Patio",
  "Pets Welcome",
  "Private Dining Rooms",
  "Private Rooms",
  "Tube Feeding (Minimal Assistance)",
  "Tube Feeding (Non-Assisted)",
  "Rehabilitation Care",
  "Respite/Short-Term & Long-Term Stays",
  "Secured & Specialized Memory Support",
  "Secured & Specialized Memory Support Unit",
  "Senior Day Care",
  "Service Coordination",
  "Small Pets Welcome",
  "Smoking (Outside)",
  "Transportation Arrangements",

  "Wellness Program",
  "Wheelchair Access",
  "Wi-Fi",
];

const CheckboxAmenities = () => {
  const [selectedAmenities, setSelectedAmenities] = useState({});
  const [businessInfoId, setBusinessInfoId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const fetchBusinessInfoId = async () => {
      try {
        const response = await axios.get("/api/getcommunityid");
        const latestEntry = response.data.data?.[response.data.data.length - 1];

        if (latestEntry && latestEntry.id) {
          setBusinessInfoId(latestEntry.id);
        } else {
          throw new Error("No valid entry found.");
        }
      } catch (error) {
        console.error("Error fetching business info:", error);
        toast.error("Failed to fetch business info.");
      }
    };

    fetchBusinessInfoId();
  }, []);

  useEffect(() => {
    const fetchAmenities = async () => {
      if (!businessInfoId) return;

      try {
        const response = await axios.get(`/api/checkboxamenitIes`, {
          params: { businessInfoId },
        });

        if (response.data.data && response.data.data.amenities) {
          const amenities = response.data.data.amenities.reduce(
            (acc, amenity) => {
              acc[amenity] = true;
              return acc;
            },
            {}
          );
          setSelectedAmenities(amenities);
          setIsEdit(true);
        }
      } catch (error) {
        console.error("Error fetching amenities:", error);
        toast.error("Failed to fetch amenities.");
      }
    };

    fetchAmenities();
  }, [businessInfoId]);

  const handleCheckboxChange = (amenity) => {
    setSelectedAmenities((prev) => ({
      ...prev,
      [amenity]: !prev[amenity],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!businessInfoId) {
      toast.error("Business info ID not available.");
      return;
    }

    const amenities = Object.keys(selectedAmenities).filter(
      (key) => selectedAmenities[key]
    );

    try {
      if (isEdit) {
        await axios.put("/api/checkboxamenitIes", {
          amenities,
          businessInfoId,
        });
        toast.success("Amenities updated successfully!");
      } else {
        await axios.post("/api/checkboxamenitIes", {
          amenities,
          businessInfoId,
        });
        toast.success("Amenities created successfully!");
      }
    } catch (error) {
      console.error("Error submitting amenities:", error);
      toast.error("Failed to save amenities. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className=" p-4 border-blue-500 rounded-lg border-2 pt-4  gap-4 shadow-sm mt-2  flex  md:flex-row flex-col ">
        <ToastContainer />
        <div>
          {amenities1.map((amenity, index) => (
            <Checkbox
              key={index}
              label={amenity}
              checked={selectedAmenities[amenity] || false}
              onChange={() => handleCheckboxChange(amenity)}
            />
          ))}
        </div>
        <div>
          {amenities2.map((amenity, index) => (
            <Checkbox
              key={index}
              label={amenity}
              checked={selectedAmenities[amenity] || false}
              onChange={() => handleCheckboxChange(amenity)}
            />
          ))}
        </div>
        <div>
          {amenities3.map((amenity, index) => (
            <Checkbox
              key={index}
              label={amenity}
              checked={selectedAmenities[amenity] || false}
              onChange={() => handleCheckboxChange(amenity)}
            />
          ))}
        </div>
      </div>
      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {isEdit ? "Update" : "Submit"}
      </button>
    </form>
  );
};

export default CheckboxAmenities;
