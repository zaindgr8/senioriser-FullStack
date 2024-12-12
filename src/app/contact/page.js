"use client";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/contect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Message sent successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        toast.error("Failed to send message.");
      }
    } catch (error) {
      toast.error("Error submitting the form.");
      console.error("Error:", error);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="main-content mt-6">
        <div className="border-bottom py-3">
          <div className="container">
            {/* Start Breadcrumbs */}
            <div className="row gy-2 gx-4 gx-md-5">
              <h4 className="col-auto fs-18 fw-semibold mb-0 page-title text-capitalize">
                Contact Us
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
                    Contact
                  </li>
                </ol>
              </div>
            </div>
            {/* End Breadcrumbs */}
          </div>
        </div>
        <div className="py-5 position-relative">
          <div className="container position-relative py-4 z-1">
            <div className="row justify-content-center">
              <div className="col-md-10">
                {/* Start Section Header Title */}
                <div className="section-header text-center mb-5">
                  <h2 className="h1 fw-semibold mb-3 section-header__title text-capitalize">
                    Let us hear from you directly!
                  </h2>
                  <div className="sub-title fs-16">
                    We're here to assist you. Feel free to reach out to us!
                  </div>
                </div>
                {/* End Section Header */}
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-md-12 col-lg-10">
                <div className="row align-items-center">
                  <div className="col-md-7 pe-xl-5 mb-5 mb-md-0">
                    <img
                      src="assets/img/png-img/grany.jpg"
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                  <div className="col-md-5">
                    <form onSubmit={handleSubmit}>
                      <div className="relative mb-4">
                        <label
                          htmlFor="name"
                          className="absolute text-md  text-gray-500 left-2 -top-3 bg-white px-1"
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="form-control px-3 py-2 border border-gray-300 rounded-md w-full mt-6"
                          placeholder="Enter Your Name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="relative mb-4">
                        <label
                          htmlFor="email"
                          className="absolute text-base text-gray-500 left-2 -top-3 bg-white px-1"
                        >
                          Your Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="form-control px-3 py-2 border border-gray-300 rounded-md w-full mt-6"
                          placeholder="Enter Your Email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="relative mb-4">
                        <label
                          htmlFor="phone"
                          className="absolute text-base text-gray-500 left-2 -top-3 bg-white px-1"
                        >
                          Your Phone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          className="form-control px-3 py-2 border border-gray-300 rounded-md w-full mt-6"
                          placeholder="Enter Your Contact"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="relative mb-4">
                        <label
                          htmlFor="message"
                          className="absolute text-base text-gray-500 left-2 -top-3 bg-white px-1"
                        >
                          Your Comments
                        </label>
                        <textarea
                          id="message"
                          rows="5"
                          className="form-control px-3 py-2 border border-gray-300 rounded-md w-full mt-6"
                          placeholder="Tell Us What We Can Help You With!"
                          value={formData.message}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn bg-blue-500 text-white hover:bg-blue-300 btn-lg d-inline-flex hstack gap-2"
                      >
                        <span>Send message</span>
                        <span className="vr" />
                        <i className="fa-arrow-right fa-solid fs-14" />
                      </button>
                    </form>
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
