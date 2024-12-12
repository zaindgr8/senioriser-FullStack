"use client";

import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to determine email provider link based on the domain

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post("/api/forgot_password", { email });
      if (response.status === 200) {
        setMessage(response.data.message);
        setError("");
        setEmail("");
        toast.success("Email sent successfully! Check your inbox.");
      }
    } catch (error) {
      setMessage("");
      setError(error.response?.data?.error || "An error occurred");
      toast.error("Failed to send email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <ToastContainer />
      <div className="border-bottom py-3">
        <div className="container">
          <div className="row gy-2 gx-4 gx-md-5">
            <h4 className="col-auto fs-18 fw-semibold mb-0 page-title text-capitalize">
              Forgot Password
            </h4>
            <div className="border-start col-auto">
              <ol className="align-items-center breadcrumb fw-medium mb-0">
                <li className="breadcrumb-item d-flex align-items-center">
                  <Link href="/" className="text-decoration-none">
                    <i className="fa-solid fa-house-chimney-crack fs-18" />
                  </Link>
                </li>
                <li
                  className="breadcrumb-item d-flex align-items-center active"
                  aria-current="page"
                >
                  Password Reset
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      <div className="py-5">
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-sm-8 col-md-7 col-lg-6 col-xl-5 col-xxl-4">
              <div className="p-4 p-sm-5 rounded-4 shadow bg-white">
                <img
                  src="/assets/img/png-img/forgot-password.png"
                  alt="Forgot Password"
                  className="img-fluid mb-4 w-75"
                />
                <div className="text-center mb-4">
                  <h3 className="fw-semibold">
                    Password{" "}
                    <span className="underline position-relative text-primary">
                      Reset
                    </span>
                  </h3>
                  <p className="text-muted text-center mb-0">
                    Fill in your email to receive instructions on how to reset
                    your password.
                  </p>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-4">
                    <label className="required">Enter Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Reset password"}
                  </button>
                </form>

                {/* Show success message */}
                {message && (
                  <div className="alert alert-success mt-3">{message}</div>
                )}

                {/* Show error message */}
                {error && (
                  <div className="alert alert-danger mt-3">{error}</div>
                )}

                <div className="bottom-text text-center mt-3">
                  Remember your password?{" "}
                  <Link
                    href="/signin"
                    className="fw-medium text-decoration-underline"
                  >
                    Log in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
