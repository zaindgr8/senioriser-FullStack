"use client";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "../community/Community-Sidebar";
import SectionHeader from "../../components/SectionHeader";
import Button from "../../components/Button";

const Page = () => {
  const [activeTab, setActiveTab] = useState("GENERAL");
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    eventName: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    repeatEvent: "Never",
    eventDetails: "",
    eventUrl: "",
  });

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/event");
      const data = await response.json();
      setEvents(data);
      toast.success("Events loaded successfully!");
    } catch (error) {
      toast.error("Error fetching events");
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Event added successfully!");
        setFormData({
          eventName: "",
          eventDate: "",
          startTime: "",
          endTime: "",
          repeatEvent: "Never",
          eventDetails: "",
          eventUrl: "",
        });
        fetchEvents(); // Refresh the list of events
      } else {
        toast.error("Failed to add event.");
      }
    } catch (error) {
      toast.error("Error submitting the form");
      console.error("Error submitting the form:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/event/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Event deleted successfully!");
        fetchEvents(); // Refresh the list of events after deletion
      } else {
        toast.error("Failed to delete event.");
      }
    } catch (error) {
      toast.error("Error deleting event");
      console.error("Error deleting event:", error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "GENERAL":
        return (
          <div className="justify-between w-full items-center p-4 border-blue-500 rounded-lg border-2 pt-4 shadow-sm mt-2 gap-4">
            <div>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                isActive={activeTab === "SPECIALTIES"}
                onClick={() => setActiveTab("SPECIALTIES")}
              >
                + Add Event
              </button>
              <button
                className="ml-4 bg-white text-blue-500 border border-blue-500 py-2 px-4 rounded-md hover:bg-blue-100"
                onClick={fetchEvents}
              >
                Refresh
              </button>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">
                      EVENT NAME
                    </th>
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">
                      DATE
                    </th>
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">
                      START TIME
                    </th>
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">
                      END TIME
                    </th>
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">
                      REPEAT EVENT
                    </th>
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">
                      EVENT URL
                    </th>
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">
                      ACTION
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id}>
                      <td className="py-2 px-4 text-sm text-gray-600">
                        {event.eventName}
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-600">
                        {new Date(event.eventDate).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-600">
                        {event.startTime}
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-600">
                        {event.endTime}
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-600">
                        {event.repeatEvent}
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-600">
                        {event.eventUrl}
                      </td>
                      <td className="py-2 px-4 text-sm text-blue-500 hover:underline cursor-pointer">
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="text-blue-500"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "AMENITIES":
        return (
          <div className="justify-between w-full items-center p-4 border-blue-500 rounded-lg border-2 pt-4 shadow-sm mt-2 gap-4">
            <div className="mt-4 overflow-x-auto">
              <table className="bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">
                      EVENT NAME
                    </th>
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">
                      DATE
                    </th>
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">
                      START TIME
                    </th>
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">
                      END TIME
                    </th>
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">
                      REPEAT EVENT
                    </th>
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">
                      EVENT URL
                    </th>
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">
                      ACTION
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id}>
                      <td className="py-2 px-4 text-sm text-gray-600">
                        {event.eventName}
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-600">
                        {new Date(event.eventDate).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-600">
                        {event.startTime}
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-600">
                        {event.endTime}
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-600">
                        {event.repeatEvent}
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-600">
                        {event.eventUrl}
                      </td>
                      <td className="py-2 px-4 text-sm text-blue-500 hover:underline cursor-pointer">
                        Edit
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "SPECIALTIES":
        return (
          <div className="p-4 border-blue-500 rounded-lg border-2 pt-4 shadow-sm mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Add Event</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="event-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Event Name
                  </label>
                  <input
                    type="text"
                    id="eventName"
                    value={formData.eventName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="eventDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Event Date
                    </label>
                    <input
                      type="date"
                      id="eventDate"
                      value={formData.eventDate}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="startTime"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Start Time
                    </label>
                    <input
                      type="time"
                      id="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="endTime"
                      className="block text-sm font-medium text-gray-700"
                    >
                      End Time
                    </label>
                    <input
                      type="time"
                      id="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="repeatEvent"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Repeat Event
                  </label>
                  <select
                    id="repeatEvent"
                    value={formData.repeatEvent}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option>Never</option>
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="eventDetails"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Event Details
                  </label>
                  <textarea
                    id="eventDetails"
                    value={formData.eventDetails}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="eventUrl"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Event Url
                  </label>
                  <input
                    type="url"
                    id="eventUrl"
                    value={formData.eventUrl}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col md:mt-10 md:flex-row">
        <Sidebar />
        <div className="flex flex-col md:mx-10">
          <SectionHeader title="Dashboard">
            <p>Company Name: [Insert Company Name]</p>
          </SectionHeader>
          <div className="flex space-x-6 m-2 p-2 bg-gray-100 rounded-md shadow-sm">
            <Button
              isActive={activeTab === "GENERAL"}
              onClick={() => setActiveTab("GENERAL")}
            >
              YOUR EVENTS
            </Button>
            <Button
              isActive={activeTab === "AMENITIES"}
              onClick={() => setActiveTab("AMENITIES")}
            >
              ALL EVENTS AROUND ME
            </Button>
            <Button
              isActive={activeTab === "SPECIALTIES"}
              onClick={() => setActiveTab("SPECIALTIES")}
            >
              ADD
            </Button>
          </div>
          <div className="mt-4">{renderContent()}</div>
        </div>
      </div>
    </>
  );
};

export default Page;
