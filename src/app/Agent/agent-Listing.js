"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import InputField from "../../components/InputField";
import SectionContainer from "../../components/SectionContainer";
import Checkbox from "../../components/Checkbox";

const Agentlisting = () => {
  const [filePreview, setFilePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [businessTypes, setBusinessTypes] = useState({}); // Store all business types and services
  const [initialData, setInitialData] = useState({
    agentName: "",
    address: "",
    id: "",
    businessType: "", // Store businessType in initialData
    services: [], // Store services in initialData
  });

  const [formData, setFormData] = useState({
    id: "", // The ID of the existing business detail (for updates)
    dba: "",
    yearFounded: "",
    license: "",
    country: "",
    city: "",
    state: "",
    zip: "",
    website: "",
    primaryPhone: "",
    ext: "",
    cellPhone: "",
    fax: "",
    link1: "", // Added link1
    link2: "", // Added link2
    link3: "", // Added link3
    link4: "", // Added link4
    Corporation: [],
    Status: [],
    companyOverview: "",
    agentbusinessInfoId: "",
    businessType: "",
    services: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/agentBusinessinfo");
        const latestEntry = response.data[response.data.length - 1];

        if (latestEntry && latestEntry.id) {
          setInitialData({
            agentName: latestEntry.agentName,
            address: latestEntry.address,
            id: latestEntry.id,
            businessType: latestEntry.businessType,
            services: latestEntry.services,
          });

          setFormData((prevFormData) => ({
            ...prevFormData,
            agentbusinessInfoId: latestEntry.id,
            businessType: latestEntry.businessType,
            services: latestEntry.services,
          }));

          // Fetch the agent business details if they exist
          const detailsResponse = await axios.get(
            `/api/agentBusinessDetails?agentbusinessInfoId=${latestEntry.id}`
          );
          const existingDetails = detailsResponse.data.data[0]; // Assuming there's only one set of details

          if (existingDetails) {
            setFormData((prevFormData) => ({
              ...prevFormData,
              id: existingDetails.id,
              dba: existingDetails.dba || "",
              yearFounded: existingDetails.yearFounded || "",
              license: existingDetails.license || "",
              country: existingDetails.country || "",
              city: existingDetails.city || "",
              state: existingDetails.state || "",
              zip: existingDetails.zip || "",
              website: existingDetails.website || "",
              primaryPhone: existingDetails.primaryPhone || "",
              ext: existingDetails.ext || "",
              cellPhone: existingDetails.cellPhone || "",
              fax: existingDetails.fax || "",
              link1: existingDetails.link1 || "", // Added link1
              link2: existingDetails.link2 || "", // Added link2
              link3: existingDetails.link3 || "", // Added link3
              link4: existingDetails.link4 || "", // Added link4
              Corporation: existingDetails.Corporation || [],
              Status: existingDetails.Status || [],
              companyOverview: existingDetails.companyOverview || "",
              image: existingDetails.image || "",
            }));
          }
        } else {
          toast.error("Failed to fetch valid initial data.");
        }

        setBusinessTypes(businessTypesData);
      } catch (error) {
        console.error("Fetching error:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "businessType") {
      setFormData({
        ...formData,
        businessType: value,
        services: [], // Reset services when businessType changes
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCheckboxChange = (name, value) => {
    setFormData((prevState) => {
      const updatedArray = prevState[name].includes(value)
        ? prevState[name].filter((item) => item !== value)
        : [...prevState[name], value];
      return { ...prevState, [name]: updatedArray };
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === "string") {
          setFilePreview(result);
          setFormData((prevState) => ({
            ...prevState,
            image: result,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agentbusinessInfoId) {
      toast.error("Business Info ID is required.");
      return;
    }

    try {
      const response = await axios({
        method: formData.id ? "put" : "post", // Use PUT if updating, POST if creating
        url: "/api/agentBusinessDetails",
        data: formData,
      });

      
      toast.success("Data submitted successfully!");
    } catch (error) {
      console.error("Submission error:", error);
      const errorMsg =
        error.response?.data?.error || "Unable to submit business data.";
      toast.error(errorMsg);
    }
  };

  return (
    <div>
      <ToastContainer />
      <SectionContainer title="Basic Information">
        <form onSubmit={handleSubmit} className="m-2">
          <div className="flex flex-wrap justify-center gap-2">
            <InputField
              label="Business Name"
              id="business_name"
              placeholder="Business Name"
              name="businessName"
              value={initialData.agentName} // Correct field name
              readOnly
            />
            <InputField
              label="DBA"
              id="dba"
              placeholder="DBA"
              name="dba"
              value={formData.dba}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-12">
            <InputField
              label="Year Founded"
              id="year_founded"
              placeholder="Year Founded"
              name="yearFounded"
              value={formData.yearFounded}
              onChange={handleChange}
            />
            <InputField
              label="License"
              id="license"
              placeholder="License"
              name="license"
              value={formData.license}
              onChange={handleChange}
            />
          </div>
          <div className="md:mx-16 gap-28 p-4 flex">
            <div className="flex-col items-center border-b border-gray-300 pb-2">
              <label htmlFor="business-type" className="mr-2">
                Business Type
              </label>

              <div className="mt-2">
                <h1 className=" pt-2">{initialData.businessType}</h1>
              </div>
            </div>

            <div className=" flex">
              <div className="flex flex-col border-b border-gray-300 pb-2">
                <label htmlFor="services" className="mr-2">
                  Services (Check all that apply)
                </label>
                <div id="services" className="mt-2 flex gap-3">
                  {initialData.services.map((service) => (
                    <div key={service}>{service},</div> // Display each service
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="md:mx-20 gap-60 mt-3 flex flex-wrap">
            <div>
              <h1 className="pb-2">Corporation Type</h1>
              <Checkbox
                id="corporation1"
                label="Publicly Traded"
                checked={formData.Corporation.includes("Corporation Type 1")}
                onChange={() =>
                  handleCheckboxChange("Corporation", "Corporation Type 1")
                }
              />
              <Checkbox
                id="corporation2"
                label="Private"
                checked={formData.Corporation.includes("Corporation Type 2")}
                onChange={() =>
                  handleCheckboxChange("Corporation", "Corporation Type 2")
                }
              />
            </div>
            <div>
              <h1 className="pb-2">Status</h1>
              <Checkbox
                id="status1"
                label="Profit"
                checked={formData.Status.includes("Status 1")}
                onChange={() => handleCheckboxChange("Status", "Status 1")}
              />
              <Checkbox
                id="status2"
                label="Non Profit"
                checked={formData.Status.includes("Status 2")}
                onChange={() => handleCheckboxChange("Status", "Status 2")}
              />
            </div>
          </div>
          <SectionContainer title="Contact Information">
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <InputField
                label="Address"
                id="address"
                placeholder="Address"
                name="address"
                value={initialData.address} // Correct field name
                readOnly
              />
              <InputField
                label="City"
                id="city"
                placeholder="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <InputField
                label="State"
                id="state"
                placeholder="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
              <InputField
                label="Zip"
                id="zip"
                placeholder="Zip"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
              />
              <InputField
                label="Country"
                id="country"
                placeholder="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
              <InputField
                label="Website"
                id="website"
                placeholder="Website"
                name="website"
                value={formData.website}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              <InputField
                label="Primary Phone"
                id="primary_phone"
                placeholder="Primary Phone"
                name="primaryPhone"
                value={formData.primaryPhone}
                onChange={handleChange}
              />
              <InputField
                label="Ext."
                id="ext"
                placeholder="Ext."
                name="ext"
                value={formData.ext}
                onChange={handleChange}
              />
              <InputField
                label="Cell Phone"
                id="cell_phone"
                placeholder="Cell Phone"
                name="cellPhone"
                value={formData.cellPhone}
                onChange={handleChange}
              />
              <InputField
                label="Fax"
                id="fax"
                placeholder="Fax"
                name="fax"
                value={formData.fax}
                onChange={handleChange}
              />
            </div>
          </SectionContainer>
          <SectionContainer title="External Website">
            <div className="grid md:grid-flow-row gap-2 grid-flow-col">
              <InputField
                label="Facebook"
                id="link1"
                placeholder="Facebook"
                name="link1"
                value={formData.link1}
                onChange={handleChange}
              />
              <InputField
                label="Instagram"
                id="link2"
                placeholder="Instagram"
                name="link2"
                value={formData.link2}
                onChange={handleChange}
              />
              <InputField
                label="LinkedIn"
                id="link3"
                placeholder="LinkedIn"
                name="link3"
                value={formData.link3}
                onChange={handleChange}
              />
              <InputField
                label="YouTube"
                id="link4"
                placeholder="YouTube"
                name="link4"
                value={formData.link4}
                onChange={handleChange}
              />
            </div>
          </SectionContainer>
          <SectionContainer title="Company Overview">
            <div className="flex flex-wrap">
              <div className="w-full md:w-3/4 px-3 mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="company-overview"
                >
                  Company Overview
                </label>
                <textarea
                  id="company-overview"
                  rows="5"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  name="companyOverview"
                  value={formData.companyOverview}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div>
                <h1 className="pb-2 font-bold">Add logo</h1>
                <input type="file" name="file" onChange={handleImageUpload} />
                {filePreview ? (
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="h-32 w-32 object-cover mt-4"
                  />
                ) : (
                  formData.image && (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="h-32 w-32 object-cover mt-4"
                    />
                  )
                )}
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 w-24 rounded"
            >
              Submit
            </button>
          </SectionContainer>
        </form>
      </SectionContainer>
    </div>
  );
};

export default Agentlisting;
