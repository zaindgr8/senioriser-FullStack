"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function User() {
  const [formData, setFormData] = useState({
    UserauthId: null,
    email: "",
    fullName: "",
    password: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/signup", {
          method: "GET",
        });

        if (response.ok) {
          const userData = await response.json();
          setFormData((prevData) => ({
            ...prevData,
            UserauthId: userData.id,
            email: userData.email,
            fullName: userData.fullName,
            password: userData.password,
          }));
        } else {
          toast.error("Failed to fetch user data");
        }
      } catch (error) {
        toast.error("Error fetching user data");
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.UserauthId) {
      toast.error("UserauthId is not set.");
      return;
    }

    try {
      const response = await fetch("/api/signup", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          fullName: formData.fullName,
          password: formData.password,
        }),
      });

      if (response.ok) {
        await response.json();
        toast.success("User profile updated successfully!");
      } else {
        toast.error("Failed to update user profile");
      }
    } catch (error) {
      toast.error("Error submitting the form");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="w-full">
        <div className="p-4 border-blue-500 rounded-lg border-2 pt-4 shadow-sm mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          <form
            className="bg-white w-full rounded px-8 pt-6 pb-8 mb-4"
            onSubmit={handleSubmit}
          >
            <div className="w-full px-3 mb-6 md:mb-0">
              {/* Email */}
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />

              {/* Full Name */}
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="full-name"
              >
                Full Name
              </label>
              <input
                type="text"
                id="full-name"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                required
              />

              {/* Password */}
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="text"
                id="password"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>

            {/* Submit Button */}
            <button
              className="btn btn-primary btn-login hstack gap-2 bg-blue-400 text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Update User
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
