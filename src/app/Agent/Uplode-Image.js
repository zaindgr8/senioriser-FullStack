import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ImagesUpload = () => {
  const [previews, setPreviews] = useState([]); // For preview URLs
  const [images, setImages] = useState([]); // Store image objects with ID and URL
  const [agentbusinessInfoId, setAgentbusinessInfoId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch the latest agentBusinessInfoId on component mount
  useEffect(() => {
    const fetchLatestEntry = async () => {
      try {
        const response = await axios.get("/api/agentBusinessinfo");
        const latestEntry = response.data[response.data.length - 1];

        if (latestEntry && latestEntry.id) {
          setAgentbusinessInfoId(latestEntry.id);
        } else {
          toast.error("Failed to fetch the latest agent business info ID.");
        }
      } catch (error) {
        console.error("Fetching error:", error);
        toast.error("Failed to fetch agent business info ID.");
      }
    };

    fetchLatestEntry();
  }, []);

  // Fetch existing images for the given agentbusinessInfoId
  useEffect(() => {
    const fetchImages = async () => {
      if (!agentbusinessInfoId) return; // Ensure agentbusinessInfoId is available

      try {
        const response = await fetch(
          `/api/agentimage?agentbusinessInfoId=${agentbusinessInfoId}`
        );
        const result = await response.json();

        if (response.ok && result.data && result.data.length > 0) {
          // Store both image URL and image ID in the images array
          setPreviews(result.data.map((img) => img.image)); // Only for preview
          setImages(result.data); // Store full image object with ID and image URL
          setIsEditMode(true);
        } else {
          setIsEditMode(false);
        }
      } catch (error) {
        toast.error("Failed to fetch images.");
        console.error("Fetch error:", error);
      }
    };

    fetchImages();
  }, [agentbusinessInfoId]);

  // Handle file drop
  const onDrop = useCallback((acceptedFiles) => {
    const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);

    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImages((prev) => [...prev, { image: reader.result }]); // Add base64 string for new image
        }
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  // Handle image upload
  const handleSubmit = async () => {
    if (!agentbusinessInfoId) {
      toast.error("No agent business info ID found.");
      return;
    }

    try {
      const response = await fetch("/api/agentimage", {
        method: isEditMode ? "PUT" : "POST", // Use PUT if editing existing images
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          images: images.map((img) => img.image), // Send only the image data
          agentbusinessInfoId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      toast.success("Images uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload images.");
    }
  };

  // Handle image deletion
  const handleDelete = async (imageId) => {
    try {
      const response = await fetch(`/api/agentimage?imageId=${imageId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete image.");
      }

      const result = await response.json();
      toast.success("Image deleted successfully!");

      // Remove the deleted image from previews and images state
      setPreviews((prev) =>
        prev.filter((_, idx) => images[idx].id !== imageId)
      );
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete image.");
    }
  };

  return (
    <div className="h-full border-blue-500 rounded-lg border-2 pt-4 shadow-sm w-full mt-2">
      <div className="container mx-auto mt-4">
        <ToastContainer />
        <h2 className="text-2xl font-semibold mb-4">Listing Photos / Ads</h2>
        <div
          {...getRootProps()}
          className="border-dashed border-2 border-gray-400 rounded-lg p-4 text-center cursor-pointer"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
        </div>
        <div className="flex flex-wrap mt-4">
          {previews.map((preview, index) => (
            <div key={index} className="w-32 h-32 m-2 relative">
              <img
                src={preview}
                alt={`Preview ${index}`}
                className="w-full h-full object-cover rounded"
              />
              <button
                onClick={() => handleDelete(images[index].id)} // Delete image by ID
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className="mt-4 mb-4  bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isEditMode ? "Update Images" : "Upload Images"}
        </button>
      </div>
    </div>
  );
};

export default ImagesUpload;
