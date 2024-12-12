import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Incentives = () => {
  const [activeTab, setActiveTab] = useState("current");
  const [incentiveName, setIncentiveName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [valueOfIncentive, setValueOfIncentive] = useState("");
  const [inPercent, setInPercent] = useState(false);
  const [description, setDescription] = useState("");
  const [legalDisclaimer, setLegalDisclaimer] = useState("");

  const [currentIncentives, setCurrentIncentives] = useState([]);
  const [upcomingIncentives, setUpcomingIncentives] = useState([]);
  const [expiredIncentives, setExpiredIncentives] = useState([]);

  useEffect(() => {
    fetchIncentives();
  }, []);

  const fetchIncentives = async () => {
    try {
      const response = await fetch("/api/incentives");
      const data = await response.json();

      setCurrentIncentives(data.currentIncentives);
      setUpcomingIncentives(data.upcomingIncentives);
      setExpiredIncentives(data.expiredIncentives);
    } catch (error) {
      toast.error("Failed to fetch incentives");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/incentives/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Incentive deleted successfully");
        fetchIncentives(); // Refresh incentives after deletion
      } else {
        toast.error("Failed to delete incentive");
      }
    } catch (error) {
      toast.error("Error deleting incentive");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const incentiveData = {
      incentiveName,
      startDate,
      endDate,
      valueOfIncentive: parseFloat(valueOfIncentive),
      inPercent,
      description,
      legalDisclaimer,
    };

    try {
      const response = await fetch("/api/incentives", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(incentiveData),
      });

      if (response.ok) {
        toast.success("Incentive created successfully");

        setIncentiveName("");
        setStartDate("");
        setEndDate("");
        setValueOfIncentive("");
        setInPercent(false);
        setDescription("");
        setLegalDisclaimer("");

        fetchIncentives(); // Refresh incentives after adding a new one
      } else {
        toast.error("Failed to create incentive");
      }
    } catch (error) {
      toast.error("Error submitting the form:");
    }
  };

  const renderIncentives = (incentives) => (
    <div className="overflow-x-auto">
      <ToastContainer />
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b border-gray-300">DURATION</th>
            <th className="py-2 px-4 border-b border-gray-300">TITLE</th>
            <th className="py-2 px-4 border-b border-gray-300">VALUE</th>
            <th className="py-2 px-4 border-b border-gray-300">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {incentives.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-4 text-gray-500">
                There are no incentives
              </td>
            </tr>
          ) : (
            incentives.map((incentive) => (
              <tr key={incentive.id}>
                <td className="py-2 px-4 border-b border-gray-300">
                  {new Date(incentive.startDate).toLocaleDateString()} -{" "}
                  {new Date(incentive.endDate).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b border-gray-300">
                  {incentive.incentiveName}
                </td>
                <td className="py-2 px-4 border-b border-gray-300">
                  {incentive.inPercent
                    ? `${incentive.valueOfIncentive}%`
                    : `$${incentive.valueOfIncentive}`}
                </td>
                <td className="py-2 px-4 border-b border-gray-300">
                  <button
                    onClick={() => handleDelete(incentive.id)}
                    className="text-blue-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 ${
            activeTab === "current"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("current")}
        >
          CURRENT
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "expired"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("expired")}
        >
          EXPIRED
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "add"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("add")}
        >
          ADD
        </button>
      </div>

      {activeTab === "current" && (
        <div>
          <button
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => setActiveTab("add")}
          >
            + Add Incentive
          </button>
          <h2 className="text-lg font-semibold">Current Incentives</h2>
          {renderIncentives(currentIncentives)}
          <h2 className="text-lg font-semibold mt-6">Upcoming Incentives</h2>
          {renderIncentives(upcomingIncentives)}
        </div>
      )}

      {activeTab === "expired" && (
        <div>
          <h2 className="text-lg font-semibold">Expired Incentives</h2>
          {renderIncentives(expiredIncentives)}
        </div>
      )}

      {activeTab === "add" && (
        <div className="justify-between items-center p-4 border-blue-500 rounded-lg border-2 pt-4 shadow-sm mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4">
            <div className="mb-4">
              <h1 className="text-2xl text-center font-semibold mb-4">
                Create an Incentive
              </h1>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="incentiveName"
              >
                Incentive Name
              </label>
              <input
                id="incentiveName"
                type="text"
                value={incentiveName}
                onChange={(e) => setIncentiveName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="flex justify-between mb-4">
              <div className="w-1/2 mr-2">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="startDate"
                >
                  Start Date
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="w-1/2 ml-2">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="endDate"
                >
                  End Date
                </label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="valueOfIncentive"
              >
                Value of incentive
              </label>
              <div className="flex items-center">
                <input
                  id="valueOfIncentive"
                  type="number"
                  value={valueOfIncentive}
                  onChange={(e) => setValueOfIncentive(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                />
                <label className="flex items-center text-gray-700 text-sm font-bold">
                  <input
                    type="checkbox"
                    checked={inPercent}
                    onChange={() => setInPercent(!inPercent)}
                    className="mr-1"
                  />
                  In percent (%)
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="legalDisclaimer"
              >
                Legal Disclaimer
              </label>
              <textarea
                id="legalDisclaimer"
                value={legalDisclaimer}
                onChange={(e) => setLegalDisclaimer(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded mr-2 hover:bg-blue-700 focus:outline-none focus:shadow-outline"
              >
                Submit
              </button>
              <button
                type="button"
                className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-700 focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
            </div>

            <p className="text-sm text-gray-600 mt-4">
              Note: Once an incentive is published you may delete the incentive
              before the expiration date, but the incentive may not be edited.
            </p>
          </form>
        </div>
      )}
    </div>
  );
};

export default Incentives;
