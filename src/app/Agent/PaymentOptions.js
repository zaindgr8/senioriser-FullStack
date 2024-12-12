import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PaymentOptions() {
  const [paymentOptions, setPaymentOptions] = useState({
    visa: false,
    mastercard: false,
    amex: false,
    discover: false,
    paypal: false,
    applepay: false,
    skrill: false,
    venmo: false,
    googlepay: false,
    cash: false,
    checks: false,
    moneyorder: false,
  });

  const [agentBusinessInfoId, setAgentBusinessInfoId] = useState(null);

  useEffect(() => {
    const fetchLatestEntry = async () => {
      try {
        const response = await axios.get("/api/agentBusinessinfo");
        const latestEntry = response.data[response.data.length - 1];

        if (latestEntry && latestEntry.id) {
          setAgentBusinessInfoId(latestEntry.id);
          fetchPaymentOptions(latestEntry.id);
        } else {
          toast.error("Failed to fetch the latest agent business info ID.");
        }
      } catch (error) {
        console.error("Fetching error:", error);
        toast.error("Failed to fetch agent business info ID.");
      }
    };

    const fetchPaymentOptions = async (id) => {
      try {
        const response = await axios.get(
          `/api/paymentoptions?agentBusinessInfoId=${id}`
        );

        if (response.data) {
          setPaymentOptions((prevOptions) => ({
            ...prevOptions,
            ...response.data,
          }));
        }
      } catch (error) {
        console.error("Fetching error:", error);
        toast.error("Failed to fetch payment options.");
      }
    };

    fetchLatestEntry();
  }, []);

  const handleToggle = (option) => {
    setPaymentOptions((prevState) => ({
      ...prevState,
      [option]: !prevState[option],
    }));
  };

  const handleSave = async () => {
    try {
      if (agentBusinessInfoId) {
        if (paymentOptions.id) {
          await axios.put(`/api/paymentoptions/${paymentOptions.id}`, {
            ...paymentOptions,
            agentBusinessInfoId,
          });
        } else {
          await axios.post("/api/paymentoptions", {
            ...paymentOptions,
            agentBusinessInfoId,
          });
        }
        toast.success("Payment options saved successfully!");
      } else {
        toast.error("Agent business info ID is missing.");
      }
    } catch (error) {
      console.error("Error saving payment options:", error);
      toast.error("Failed to save payment options.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6 text-center">
        Manage Payment Options
      </h1>

      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Accepted Credit Cards</h2>
          {["visa", "mastercard", "amex", "discover"].map((option) => (
            <div key={option} className="flex items-center justify-between">
              <span className="text-gray-700 capitalize">{option}</span>
              <input
                type="checkbox"
                id={option}
                checked={paymentOptions[option]}
                onChange={() => handleToggle(option)}
                className="sr-only"
              />
              <div
                className={`relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in ${
                  paymentOptions[option] ? "bg-green-400" : "bg-gray-300"
                }`}
              >
                <label
                  htmlFor={option}
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                    paymentOptions[option] ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute block w-4 h-4 mt-1 ml-1 transform rounded-full shadow inset-y-0 left-0 focus-within:shadow-outline transition-transform duration-300 ease-in-out ${
                      paymentOptions[option]
                        ? "translate-x-full bg-white"
                        : "translate-x-0 bg-white"
                    }`}
                  ></span>
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Online Payment Options</h2>
          {["paypal", "applepay", "skrill", "venmo", "googlepay"].map(
            (option) => (
              <div key={option} className="flex items-center justify-between">
                <span className="text-gray-700 capitalize">{option}</span>
                <input
                  type="checkbox"
                  id={option}
                  checked={paymentOptions[option]}
                  onChange={() => handleToggle(option)}
                  className="sr-only"
                />
                <div
                  className={`relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in ${
                    paymentOptions[option] ? "bg-green-400" : "bg-gray-300"
                  }`}
                >
                  <label
                    htmlFor={option}
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                      paymentOptions[option] ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute block w-4 h-4 mt-1 ml-1 transform rounded-full shadow inset-y-0 left-0 focus-within:shadow-outline transition-transform duration-300 ease-in-out ${
                        paymentOptions[option]
                          ? "translate-x-full bg-white"
                          : "translate-x-0 bg-white"
                      }`}
                    ></span>
                  </label>
                </div>
              </div>
            )
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Other Payment Types</h2>
          {["cash", "checks", "moneyorder"].map((option) => (
            <div key={option} className="flex items-center justify-between">
              <span className="text-gray-700 capitalize">{option}</span>
              <input
                type="checkbox"
                id={option}
                checked={paymentOptions[option]}
                onChange={() => handleToggle(option)}
                className="sr-only"
              />
              <div
                className={`relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in ${
                  paymentOptions[option] ? "bg-green-400" : "bg-gray-300"
                }`}
              >
                <label
                  htmlFor={option}
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                    paymentOptions[option] ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute block w-4 h-4 mt-1 ml-1 transform rounded-full shadow inset-y-0 left-0 focus-within:shadow-outline transition-transform duration-300 ease-in-out ${
                      paymentOptions[option]
                        ? "translate-x-full bg-white"
                        : "translate-x-0 bg-white"
                    }`}
                  ></span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded mt-8 hover:bg-blue-600"
      >
        Save
      </button>
    </div>
  );
}
