"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const UploadField = () => {
  const [file, setFile] = useState();
  const [businessInfoId, setBusinessInfoId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "/api/community_businessinfo?endpoint=business-info"
        );

        const latestEntry = response.data[response.data.length - 1];

        setBusinessInfoId(latestEntry._id);
      } catch (error) {
        console.error("Fetching error:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please Select a File");
      return;
    }
    if (!businessInfoId) {
      alert("Business Info ID is missing");
      return;
    }
    const data = new FormData();
    data.append("file", file);
    data.append("businessInfoId", businessInfoId);

    try {
      let result = await fetch("/api/community_businessinfo?endpoint=images", {
        method: "POST",
        body: data,
      });
      result = await result.json();

      if (result.success) {
        alert("Successfully Uploaded!!");
      } else {
        alert("Failed!!");
      }
    } catch (error) {
      alert("Failed!!");
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit} className=" mx-3 mb-4">
        <input
          type="file"
          name="file"
          onChange={(e) => setFile(e.target.files?.[0])}
        />
      </form>
    </>
  );
};

export default UploadField;
