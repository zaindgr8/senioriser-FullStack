"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignIn() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "", userType: "" }); // Include userType in the user state
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const onLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Send user data, including userType, to the API
      const response = await axios.post("/api/login", user);
      toast.success("Login successful!");

      // Redirect based on userType
      if (user.userType === "AGENT") {
        window.location.href = "/create-agent";
      } else if (user.userType === "COMMUNITY_MEMBER") {
        window.location.href = "/create-community";
      }
    } catch (error) {
      // Display an error message if login fails
      toast.error(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Enable the button only when both email, password, and userType are filled in
    setButtonDisabled(
      !(
        user.email.length > 0 &&
        user.password.length > 0 &&
        user.userType.length > 0
      )
    );
  }, [user]);

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <>
      <ToastContainer />
      <div className="main-content">
        <div className="border-bottom py-3">
          <div className="container">
            <Link
              href="/"
              className="align-items-center d-flex fw-medium text-primary"
            >
              <i className="fa-solid fa-chevron-left me-1" />
              Back To Home
            </Link>
          </div>
        </div>
        <div className="py-5">
          <div className="container py-4">
            <div className="row justify-content-center">
              <div className="col-sm-10 col-lg-10">
                <div className="align-items-center g-4 row">
                  <div className="col-lg-6 col-xl-5 text-center">
                    <p>
                      We won't post anything without your permission, and your
                      personal details are kept private
                    </p>
                    <div className="align-items-center d-flex my-4">
                      <hr className="flex-grow-1 m-0" />
                      <span className="fs-16 fw-bold px-3 text-dark">Or</span>
                      <hr className="flex-grow-1 m-0" />
                    </div>
                    <form className="register-form" onSubmit={onLogin}>
                      <div className="form-group mb-4">
                        <div className="input-group relative">
                          <input
                            id="email"
                            placeholder="Email"
                            value={user.email}
                            onChange={(e) =>
                              setUser({ ...user, email: e.target.value })
                            }
                            className="form-control w-full p-2 border rounded-md"
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group mb-4">
                        <div className="input-group relative">
                          <input
                            id="password"
                            placeholder="Password"
                            type={isPasswordVisible ? "text" : "password"}
                            className="form-control w-full p-2 border rounded-md"
                            autoComplete="off"
                            required
                            value={user.password}
                            onChange={(e) =>
                              setUser({ ...user, password: e.target.value })
                            }
                          />
                          <button
                            type="button"
                            className="absolute right-2 top-2"
                            onClick={togglePasswordVisibility}
                          >
                            <i
                              className={
                                isPasswordVisible
                                  ? "fa-regular fa-eye"
                                  : "fa-regular fa-eye-slash"
                              }
                            ></i>
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className=" pb-2  ">
                          Are you a Community or Provider?
                        </label>
                        <select
                          className="form-control mb-6"
                          value={user.userType}
                          onChange={(e) =>
                            setUser({ ...user, userType: e.target.value })
                          } // Handle userType change
                          required
                        >
                          <option value="" disabled className="">
                            Select an option
                          </option>
                          <option value="COMMUNITY_MEMBER">Community</option>
                          <option value="AGENT">Provider</option>
                        </select>
                      </div>
                      <div className="form-check mb-4 text-start">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="flexCheckDefault"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexCheckDefault"
                        >
                          Remember me next time
                        </label>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100"
                        disabled={buttonDisabled}
                      >
                        {loading ? "Signing in..." : "Sign in"}
                      </button>
                    </form>
                    <div className="bottom-text text-center my-3">
                      Don't have an account?{" "}
                      <Link
                        href="/signup"
                        className="fw-medium text-decoration-underline"
                      >
                        Sign Up
                      </Link>
                      <br />
                      Remind{" "}
                      <Link
                        href="/forgot-password"
                        className="fw-medium text-decoration-underline"
                      >
                        Password
                      </Link>
                    </div>
                  </div>
                  <div className="col-lg-6 col-xl-7 order-lg-first pe-xl-5">
                    <img
                      src="assets/img/png-img/login.png"
                      alt="Login Illustration"
                      className="img-fluid"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
