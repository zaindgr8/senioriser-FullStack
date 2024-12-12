"use client";
import { useState, useEffect } from "react";
import GooglePropertyMapsComponent from "../../components/property-map"; // Correct path for map component
import Link from "next/link";
import Loading from "../../components/Loding";
export default function AgentSearchList() {
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [filters, setFilters] = useState({
    zip: "",
    city: "",
    state: "",
    agentName: "",
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

  // Fetch agents data from API
  useEffect(() => {
    async function fetchAgents() {
      try {
        setLoading(true);

        // Pass filters as query parameters to the API request
        const queryParams = new URLSearchParams({
          page,
          limit,
          zip: filters.zip,
          city: filters.city,
          state: filters.state,
          agentName: filters.agentName,
        });

        const response = await fetch(
          `/api/agentsearch?${queryParams.toString()}`
        );
        const result = await response.json();

        if (result.data) {
          setAgents(result.data); // Set agents data
          setFilteredAgents(result.data); // Display all agents initially
          setTotal(result.total);

          // Extract unique ZIP codes, cities, and states from the agents
          const zipCodes = [
            ...new Set(result.data.map((agent) => agent.agentBusiness[0]?.zip)),
          ].filter(Boolean);
          const cities = [
            ...new Set(
              result.data.map((agent) => agent.agentBusiness[0]?.city)
            ),
          ].filter(Boolean);
          const states = [
            ...new Set(
              result.data.map((agent) => agent.agentBusiness[0]?.state)
            ),
          ].filter(Boolean);

          setAvailableFilters({ zipCodes, cities, states });
        }
      } catch (error) {
        console.error("Error fetching agent data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAgents();
  }, [page, limit, filters]); // Re-fetch data when filters or pagination changes

  // Apply filters when they change
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
    setPage(1); // Reset page to 1 when filters are applied
  };

  // Calculate total pages
  const totalPages = Math.ceil(total / limit);

  // Handle pagination
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
              Providers
            </h4>
            <div className="border-start col-auto">
              <ol className="align-items-center breadcrumb fw-medium mb-0">
                <li className="breadcrumb-item d-flex align-items-center">
                  <Link href="/agent-details" className="text-decoration-none">
                    <i className="fa-solid fa-user-tie fs-18" />
                  </Link>
                </li>
                <li
                  className="breadcrumb-item d-flex align-items-center active"
                  aria-current="page"
                >
                  Providers List
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-10 offset-md-1">
          {/* Section Header */}
          <div className="section-header text-center ">
            <h2 className="h1 fw-semibold section-header__title text-capitalize">
              Providers <br /> Across USA
            </h2>
            <div className="sub-title fs-16">
              Find professional Providers to assist you with all your needs.
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="container py-4">
        <div className="search-form__wrap z-1 position-relative mb-5 properties-search">
          <div className="flex items-center space-x-2 bg-white p-4 rounded-lg shadow">
            {/* ZIP Code Input with Datalist */}
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

            {/* City Input with Datalist */}
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

            {/* State Input with Datalist */}
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

            {/* Agent Name Input */}
            <div className="flex items-center border border-gray-300 rounded-lg p-2 w-2/4">
              <input
                type="text"
                name="agentName"
                className="w-full outline-none bg-transparent"
                placeholder="Providers Name"
                value={filters.agentName}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        </div>

        {/* Results Section */}
        {loading ? (
          <Loading /> // Show loading spinner if data is being fetched
        ) : (
          <>
            <div className="d-flex flex-wrap align-items-center mb-4 gap-2">
              <h5 className="fw-semibold text-capitalize mb-0 col">
                {filteredAgents.length} Results For All Listings
              </h5>
            </div>

            <div className="row g-4">
              {/* Left: Google Map */}
              <div className="col-xl-6">
                <div className="rounded-4 map-list overflow-hidden">
                  <GooglePropertyMapsComponent />
                </div>
              </div>

              {/* Right: Agent Cards */}
              <div className="col-xl-6">
                {filteredAgents.map((agent) => (
                  <div
                    className="mb-4 overflow-hidden bg-grey border-0 shadow rounded-3"
                    data-aos="fade-up"
                    data-aos-delay={300}
                    key={agent.id}
                  >
                    <Link href={`/agent-detail/${agent.id}`}>
                      <div className="card-body p-0">
                        <div className="g-0 row">
                          <div className="bg-white col-lg-5 col-md-6 col-xl-3 position-relative">
                            <div className="card-image-hover overflow-hidden position-relative h-100">
                              <img
                                src={
                                  agent.agentBusiness.length > 0 &&
                                  agent.agentBusiness[0].image
                                    ? agent.agentBusiness[0].image
                                    : "/assets/my_imgs/agent.jpg"
                                }
                                alt="Agent Image"
                                className="h-100 w-100 object-fit-cover"
                              />
                            </div>
                          </div>

                          <div className="bg-white col-lg-7 col-md-6 col-xl-6 p-3 p-lg-4 p-md-3 p-sm-4">
                            <div className="d-flex flex-column h-100">
                              <div className="mb-4">
                                <h6 className="fs-23 mb-2">
                                  {agent.agentName}
                                </h6>

                                {agent.agentBusiness.length > 0 && (
                                  <>
                                    <div className="text-sm">
                                      <strong>City:</strong>{" "}
                                      {agent.agentBusiness[0]?.city ||
                                        "City not available"}
                                    </div>

                                    <div className="text-sm">
                                      <strong>State:</strong>
                                      {agent.agentBusiness[0]?.state ||
                                        "State not available"}
                                    </div>
                                    <div className="text-sm">
                                      <strong>Zip:</strong>{" "}
                                      {agent.agentBusiness[0]?.zip ||
                                        "Zip not available"}
                                    </div>
                                  </>
                                )}
                                <div className="text-sm">
                                  <strong>Type:</strong> {agent.businessType}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-12 col-md-12 col-xl-3 p-3">
                            <div className="row h-100 align-items-center justify-content-center gap-2">
                              <div className="col col-xl-12">
                                <div className="text-blue-500 text-2xl bg-white flex justify-center items-center rounded-lg p-2">
                                  More details
                                </div>
                              </div>
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
            <nav className="align-items-center border-top d-flex flex-wrap justify-content-center justify-content-sm-between pagination mt-5">
              <ul className="list-unstyled m-0 pages mt-3">
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
