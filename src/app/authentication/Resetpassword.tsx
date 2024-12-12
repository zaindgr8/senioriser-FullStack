"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation"; // To get the token from URL

export default function ResetPassword() {
  const searchParams = useSearchParams(); // Access query parameters
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [token, setToken] = useState("");
  const router = useRouter();

  // Fetch the token from the URL on component mount
  useEffect(() => {
    const Token = searchParams.get("token");
    if (Token) {
      setToken(Token);
    }
  }, [searchParams]);

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordMatchError(password !== value);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordMatchError) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // Call API to reset password
      const response = await axios.post("/api/reset_password", {
        token,
        password,
      });
      setSuccessMessage("Password has been reset successfully.");
      setErrorMessage("");
      router.push("/signin");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to reset password."
      );
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
          <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Change Password
          </h2>
          {successMessage && <p className="text-green-500">{successMessage}</p>}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <form
            className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
            onSubmit={handleSubmit}
          >
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-600"
                  onClick={togglePasswordVisibility}
                >
                  {isPasswordVisible ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  name="confirm-password"
                  id="confirm-password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-600"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {isConfirmPasswordVisible ? "Hide" : "Show"}
                </button>
              </div>
              {passwordMatchError && (
                <p className="text-sm text-red-600 mt-2">
                  Passwords do not match
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full btn btn-primary btn-lg w-100"
              disabled={loading}
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
