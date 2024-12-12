"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import InputField from "../../components/InputField";
import SectionContainer from "../../components/SectionContainer";
import Checkbox from "../../components/Checkbox";

const Communitylisting = () => {
  const [filePreview, setFilePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [initialData, setInitialData] = useState({
    businessName: "",
    address: "",
    id: "",
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
    services: "",
    image: "",
    units: "",
    link1: "", // Added link1
    link2: "", // Added link2
    link3: "", // Added link3
    link4: "", // Added link4
    companyOverview: "",
    Corporation: [],
    Status: [],
    businessInfoId: "", // The ID of the related CommunityBusinessinfo
  });

  // Fetch business name and address
  useEffect(() => {
    const fetchBusinessInfo = async () => {
      try {
        const response = await axios.get("/api/getcommunityid");
        const latestEntry = response.data.data[response.data.data.length - 1]; // Adjusting for the correct data structure
        setInitialData({
          businessName: latestEntry.CommunityName,
          address: latestEntry.address,
          id: latestEntry.id, // Assuming it's id instead of _id
        });
        setFormData((prevFormData) => ({
          ...prevFormData,
          businessInfoId: latestEntry.id, // Assuming it's id instead of _id
        }));
      } catch (error) {
        console.error("Fetching error:", error);
        toast.error("Failed to fetch initial data.");
      }
    };

    fetchBusinessInfo();
  }, []);

  // Fetch additional business details
  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        if (initialData.id) {
          // Ensure businessInfoId is available before fetching
          const response = await axios.get(
            `/api/communitlistning?businessInfoId=${initialData.id}`
          );
          const businessDetail = response.data.data[0]; // Assuming only one detail set per business

          if (businessDetail) {
            setFormData((prevFormData) => ({
              ...prevFormData,
              id: businessDetail.id,
              dba: businessDetail.dba || "",
              yearFounded: businessDetail.yearFounded || "",
              license: businessDetail.license || "",
              country: businessDetail.country || "",
              city: businessDetail.city || "",
              state: businessDetail.state || "",
              zip: businessDetail.zip || "",
              website: businessDetail.website || "",
              primaryPhone: businessDetail.primaryPhone || "",
              ext: businessDetail.ext || "",
              cellPhone: businessDetail.cellPhone || "",
              fax: businessDetail.fax || "",
              services: businessDetail.services || "",
              image: businessDetail.image || "",
              units: businessDetail.units || "",
              link1: businessDetail.link1 || "", // Add link1
              link2: businessDetail.link2 || "", // Add link2
              link3: businessDetail.link3 || "", // Add link3
              link4: businessDetail.link4 || "", // Add link4
              companyOverview: businessDetail.companyOverview || "",
              Corporation: businessDetail.Corporation || [],
              Status: businessDetail.Status || [],
              image: businessDetail.image || "",
            }));
          } else {
            console.warn("No business detail found.");
          }
        }
      } catch (error) {
        console.error("Fetching error:", error);
        toast.error("Failed to fetch business details.");
      }
    };

    fetchBusinessDetails();
  }, [initialData.id]); // Run this effect when the businessInfoId is set

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

    try {
      const submissionData = {
        ...formData,
      };

      const response = await axios({
        method: formData.id ? "put" : "post", // Use PUT if updating, POST if creating
        url: "/api/communitlistning",
        data: submissionData,
      });

      toast.success("Data submitted successfully!");
    } catch (error) {
      console.error("Submission error:", error);
      const errorMsg =
        error.response?.data?.msg || "Unable to submit business data.";
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
              value={initialData.businessName}
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
          <div className="gap-2 mt-6 md:mx-20">
            <InputField
              label="Number of Units"
              id="units"
              placeholder="Number of Units"
              name="units"
              value={formData.units}
              onChange={handleChange}
            />
          </div>
          <div className="md:mx-20 gap-60 mt-3 flex md:flex-row  lg:flex-row flex-col">
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
                value={initialData.address}
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

export default Communitylisting;
