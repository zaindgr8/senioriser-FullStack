"use client";
import { useState, useEffect } from "react";
import GooglePropertyMapsComponent from "../../components/property-map";
import Link from "next/link";
import Loding from "../../components/Loding"; // Assuming you have a loading component

export default function PropertyList() {
  const [featuresProperties, setFeaturesProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [filters, setFilters] = useState({
    zip: "",
    city: "",
    state: "",
    businessName: "",
  });
  const [availableFilters, setAvailableFilters] = useState({
    zipCodes: [],
    cities: [],
    states: [],
  });
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [loading, setLoading] = useState(true);

  // Fetch Data from API
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true); // Start loading

        // Send filters with the API request
        const queryParams = new URLSearchParams({
          page,
          limit,
          zip: filters.zip,
          city: filters.city,
          state: filters.state,
          businessName: filters.businessName,
        });

        const response = await fetch(
          `/api/getcommuntydata?${queryParams.toString()}`
        );
        const result = await response.json();

        if (result.data) {
          setFeaturesProperties(result.data);
          setFilteredProperties(result.data); // Initially display all properties
          setTotal(result.total);

          // Extract unique ZIP codes, cities, and states from the properties
          const zipCodes = [
            ...new Set(
              result.data.map((property) => property.businessDetails[0]?.zip)
            ),
          ].filter(Boolean);

          const cities = [
            ...new Set(
              result.data.map((property) => property.businessDetails[0]?.city)
            ),
          ].filter(Boolean);

          const states = [
            ...new Set(
              result.data.map((property) => property.businessDetails[0]?.state)
            ),
          ].filter(Boolean);

          setAvailableFilters({ zipCodes, cities, states });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // End loading
      }
    }

    fetchData();
  }, [page, limit, filters]); // Add filters as dependency to refetch data when filters change

  // Apply Filters and Reset Page
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
    setPage(1); // Reset page to 1 when filters change
  };

  // Handle Page Changes
  const totalPages = Math.ceil(total / limit);
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="main-content">
      {/* Header Section */}
      <div className="border-bottom py-3">
        <div className="container">
          <div className="row gy-2 gx-4 gx-md-5">
            <h4 className="col-auto fs-18 fw-semibold mb-0 page-title text-capitalize">
              Communities
            </h4>
            <div className="border-start col-auto">
              <ol className="align-items-center breadcrumb fw-medium mb-0">
                <li className="breadcrumb-item d-flex align-items-center">
                  <Link
                    href="/property-details"
                    className="text-decoration-none"
                  >
                    <i className="fa-solid fa-house-chimney-crack fs-18" />
                  </Link>
                </li>
                <li
                  className="breadcrumb-item d-flex align-items-center active"
                  aria-current="page"
                >
                  Communities List
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-10 offset-md-1">
          {/* Start Section Header Title */}
          <div className="section-header text-center ">
            {/* Start Section Header title */}
            <h2 className="h1 fw-semibold  section-header__title text-capitalize">
              Communities <br /> Across USA
            </h2>
            {/* /.End Section Header Title */}
            {/* Start Section Header Sub Title */}
            <div className="sub-title fs-16">
              Explore the premier Community Service Centers,
              <br />
              seeking service providers to help address their inquiries.
            </div>
            {/* /.End Section Header Sub Title */}
          </div>
          {/*/. End Section Header */}
        </div>
      </div>
      {/* Filters Section */}
      <div className="container py-4">
        <div className="search-form__wrap z-1 position-relative mb-3 properties-search">
          <div className="flex items-center space-x-2 bg-white p-2  md:p-4 rounded-lg shadow">
            {/* ZIP Code Input */}
            <div className="relative w-1/4">
              <input
                list="zipCodes"
                name="zip"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ZIP"
                value={filters.zip}
                onChange={handleFilterChange}
              />
              <datalist id="zipCodes">
                {availableFilters.zipCodes.map((zip) => (
                  <option key={zip} value={zip}>
                    {zip}
                  </option>
                ))}
              </datalist>
            </div>

            {/* City Input */}
            <div className="relative w-1/4">
              <input
                list="cities"
                name="city"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="City"
                value={filters.city}
                onChange={handleFilterChange}
              />
              <datalist id="cities">
                {availableFilters.cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </datalist>
            </div>

            {/* State Input */}
            <div className="relative w-1/4">
              <input
                list="states"
                name="state"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="State"
                value={filters.state}
                onChange={handleFilterChange}
              />
              <datalist id="states">
                {availableFilters.states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </datalist>
            </div>

            {/* Business Name Input */}
            <div className="flex items-center border border-gray-300 rounded-lg p-2 w-2/4">
              <input
                type="text"
                name="businessName"
                className="w-full outline-none bg-transparent"
                placeholder="Business Name"
                value={filters.businessName}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        </div>

        {/* Results Section */}
        {loading ? (
          <Loding /> // Display loading spinner if data is loading
        ) : (
          <>
            <h5 className="fw-semibold text-capitalize mb-4">
              {filteredProperties.length} Results For All Listings
            </h5>

            <div className="row g-4">
              <div className="col-xl-6">
                <div className="rounded-4 map-list overflow-hidden">
                  <GooglePropertyMapsComponent />
                </div>
              </div>

              <div className="col-xl-6">
                {filteredProperties.map((featuresProperty) => (
                  <div
                    key={featuresProperty.id}
                    className="mb-4 bg-grey border-0 shadow rounded-3"
                  >
                    <Link href={`/community-details/${featuresProperty.id}`}>
                      <div className="card-body p-0">
                        <div className="g-0 row">
                          <div className="bg-white col-lg-5 col-md-6 col-xl-3 position-relative">
                            <div className="card-image-hover overflow-hidden position-relative h-100">
                              <img
                                src={
                                  featuresProperty.propertyImages &&
                                  featuresProperty.propertyImages.length > 0
                                    ? featuresProperty.propertyImages[0]
                                        ?.image[0]
                                    : "/assets/my_imgs/agent.jpg"
                                }
                                alt="Community Image"
                                className="h-100 w-100 object-fit-cover"
                              />
                            </div>
                          </div>

                          <div className="bg-white col-lg-7 col-md-6 col-xl-6 p-3">
                            <h6 className="fs-23 mb-1">
                              {featuresProperty.CommunityName}
                            </h6>

                            <div className="text-sm">
                              <strong>City:</strong>
                              {featuresProperty.businessDetails.length > 0
                                ? featuresProperty.businessDetails[0].city
                                : ""}
                            </div>

                            <div className="text-sm">
                              <strong>State:</strong>
                              {featuresProperty.businessDetails.length > 0
                                ? featuresProperty.businessDetails[0].state
                                : ""}
                            </div>
                            <div className="text-sm">
                              <strong>Zip:</strong>
                              {featuresProperty.businessDetails.length > 0
                                ? featuresProperty.businessDetails[0].zip
                                : ""}
                            </div>
                            <div className="text-xs">
                              <strong>Type:</strong>
                              {featuresProperty.communityType
                                ?.slice(0, 2)
                                .map((type, index) => (
                                  <div key={index}>{type}</div>
                                ))}
                            </div>
                          </div>

                          <div className="col-lg-12 col-md-12 col-xl-3 p-3">
                            <div className="text-blue-500 text-2xl bg-white flex justify-center items-center rounded-lg p-2">
                              More details
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination Section */}
            <nav className="pagination mt-5 ">
              <ul className="list-unstyled flex space-x-2 m-0">
                <li className={page === 1 ? "active" : ""}>
                  <button onClick={() => handlePageChange(1)}>1</button>
                </li>
                {page > 1 && page <= totalPages && (
                  <li>
                    <button onClick={() => handlePageChange(page - 1)}>
                      Previous
                    </button>
                  </li>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <li
                      key={pageNum}
                      className={page === pageNum ? "active" : ""}
                    >
                      <button onClick={() => handlePageChange(pageNum)}>
                        {pageNum}
                      </button>
                    </li>
                  )
                )}
                {page < totalPages && (
                  <li>
                    <button onClick={() => handlePageChange(page + 1)}>
                      Next
                    </button>
                  </li>
                )}
              </ul>
            </nav>
          </>
        )}
      </div>
    </div>
  );
}
