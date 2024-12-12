"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";

export default function SignIn() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
    fullName: "",
    userType: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSignup = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/api/signup", user);

      router.push("/signin");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setButtonDisabled(
      !user.email || !user.password || !user.fullName || !user.userType
    );
  }, [user]);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
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
                    We won't post anything without your permission and your
                    personal details are kept private
                  </p>
                  <div className="align-items-center d-flex my-4">
                    <hr className="flex-grow-1 m-0" />
                    <span className="fs-16 fw-bold px-3 text-dark">Or</span>
                    <hr className="flex-grow-1 m-0" />
                  </div>
                  <form className="register-form" onSubmit={onSignup}>
                    <div className="form-group mb-4">
                      <input
                        type="text"
                        placeholder="Full Name"
                        className="form-control w-full p-2 border rounded-md"
                        required
                        value={user.fullName}
                        onChange={(e) =>
                          setUser({ ...user, fullName: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group mb-4">
                      <input
                        type="email"
                        className="form-control w-full p-2 border rounded-md"
                        placeholder="Email"
                        required
                        value={user.email}
                        onChange={(e) =>
                          setUser({ ...user, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group mb-2">
                      <div className="input-group relative">
                        <input
                          id="password"
                          placeholder="Password"
                          type={isPasswordVisible ? "text" : "password"}
                          className="form-control w-full p-2 border rounded-md"
                          autoComplete="off"
                          required
                          value={user.password}
                          onChange={(e) => {
                            setUser({ ...user, password: e.target.value });
                          }}
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
                    <div className="">
                      <label className=" pb-1">
                        Are you a Community or Provider?
                      </label>
                      <select
                        className="form-control mb-3"
                        required
                        value={user.userType}
                        onChange={(e) =>
                          setUser({ ...user, userType: e.target.value })
                        }
                      >
                        <option value="" disabled>
                          Select an option
                        </option>
                        <option value="COMMUNITY_MEMBER">Community</option>
                        <option value="AGENT">Provider</option>
                      </select>
                    </div>
                    <div className="form-check mb-3 text-start">
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
                        Account Creation{" "}
                        <Link
                          href={"/terms-and-conditions"}
                          className=" text-blue-500"
                        >
                          term and conditions
                        </Link>
                      </label>
                    </div>
                    <button
                      type="submit "
                      className="btn bg-blue-500 btn-primary btn-lg w-100"
                      disabled={buttonDisabled}
                    >
                      {loading ? "Signing Up..." : "Sign Up"}
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
                    Forgot your password?{" "}
                    <Link
                      href="/forgot-password"
                      className="fw-medium text-decoration-underline"
                    >
                      Reset here
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
  );
}
