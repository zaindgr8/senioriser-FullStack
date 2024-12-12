"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaHandsHelping } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";
import Loding from "../../components/Loding";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
const CommunityData = ({ communityId, userauthId }) => {
  const [community, setCommunity] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null); // This will hold the logged-in user's ID
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef(null);
  const [link1, setLink1] = useState(""); // For Facebook
  const [link2, setLink2] = useState(""); // For Instagram
  const [link3, setLink3] = useState(""); // For LinkedIn
  const [link4, setLink4] = useState(""); // For YouTube
  const [propertyImages, setPropertyImages] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [communityName, setCommunityName] = useState("");
  const [website, setWebsite] = useState("");
  const [companyOverview, setCompanyOverview] = useState("");
  const [address, setAddress] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [faxNumber, setfaxNumber] = useState("");
  const [cellPhone, setcellPhone] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [city, setcity] = useState("");
  const [zip, setzip] = useState("");
  const [state, setstate] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
  const [userName, setUserName] = useState(""); // Receiver's Name
  const [acceptedSponsorCount, setAcceptedSponsorCount] = useState(0);
  const [acceptedConnectionsCount, setAcceptedConnectionsCount] = useState(0);
  const [acceptedSponsorNames, setAcceptedSponsorNames] = useState([]);
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false); // Modal State
  const [agreedToTerms, setAgreedToTerms] = useState(false); // Checkbox State
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  const toggleInfoVisibility = () => {
    setIsInfoVisible(!isInfoVisible); // Toggle visibility
  };
  useEffect(() => {
    const fetchAcceptedSponsors = async () => {
      try {
        const response = await axios.get("/api/accepted-sponsors", {
          params: { userauthId },
        });
        setAcceptedSponsorCount(response.data.count); // Set sponsor count
        setAcceptedSponsorNames(response.data.sponsors); // Set sponsor names directly
      } catch (error) {
        console.error("Error fetching accepted sponsors:", error);
      }
    };

    if (userauthId) {
      fetchAcceptedSponsors();
    }
  }, [userauthId]);
  useEffect(() => {
    // Fetch the logged-in user's ID (if logged in)
    const fetchLoggedInUserId = async () => {
      try {
        const response = await axios.get("/api/getcookes");
        if (response.data?.user?.id) {
          setLoggedInUserId(response.data.user.id);
        }
      } catch (error) {
        console.error("Error fetching logged-in user ID:", error);
      }
    };
    fetchLoggedInUserId();
  }, []);

  useEffect(() => {
    // Fetch community data based on communityId and userauthId
    const fetchCommunity = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/api/communtyinfo/${communityId}/${userauthId}`
        );

        if (response.data?.data) {
          const communityInfo = response.data?.data;
          setPropertyImages(communityInfo.propertyImages || []);
          setCommunityName(communityInfo.CommunityName);
          setWebsite(communityInfo.businessDetails[0]?.website || "");
          setWebsite(communityInfo.businessDetails[0]?.website || "");
          setLink1(communityInfo.businessDetails[0]?.link1 || ""); // Store link1 (e.g., Facebook)
          setLink2(communityInfo.businessDetails[0]?.link2 || ""); // Store link2 (e.g., Instagram)
          setLink3(communityInfo.businessDetails[0]?.link3 || ""); // Store link3 (e.g., LinkedIn)
          setLink4(communityInfo.businessDetails[0]?.link4 || "");
          setCompanyOverview(
            communityInfo.businessDetails[0]?.companyOverview || ""
          );
          setAddress(communityInfo.address || "");
          setAmenities(
            communityInfo.amenities?.map((amenity) => amenity.amenities) || []
          );
          setPhoneNumber(communityInfo.businessDetails[0]?.primaryPhone || "");
          setfaxNumber(communityInfo.businessDetails[0]?.fax || "");
          setcity(communityInfo.businessDetails[0]?.city || "");
          setzip(communityInfo.businessDetails[0]?.zip || "");
          setstate(communityInfo.businessDetails[0]?.state || "");
          setLicenseNumber(communityInfo.businessDetails[0]?.license || "");
          setCompanyLogo(communityInfo.businessDetails[0]?.image || "");
          setUserName(communityInfo.userauth?.fullName || ""); // Store receiver's name
          setCommunity(response.data.data);
        } else {
          console.warn("No community data found.");
        }
      } catch (error) {
        console.error("Error fetching community:", error);
      } finally {
        setLoading(false);
      }
    };

    if (communityId && userauthId) {
      fetchCommunity();
    }
  }, [communityId, userauthId]);

  const handleSelfRequestCheck = (actionType) => {
    if (loggedInUserId === community?.userauthId) {
      toast.error(`You cannot send a ${actionType} request to yourself.`);
      return true;
    }
    return false;
  };

  const handleConnectionRequest = async (receiverId) => {
    if (handleSelfRequestCheck("connection")) return;

    try {
      const response = await axios.post("/api/community-connection", {
        receiverId,
        status: "PENDING",
      });

      if (response.status === 201) {
        toast.success("Connection request sent successfully!");
      } else {
        toast.error("Failed to send connection request.");
      }
    } catch (error) {
      console.error("Error sending connection request:", error);
      toast.error("Failed to send connection request.");
    }
  };
  useEffect(() => {
    const fetchAcceptedConnections = async () => {
      try {
        const response = await axios.get("/api/comm-connections-acc", {
          params: { userauthId }, // Ensure userauthId is passed correctly
        });

        if (response.status === 200) {
          setAcceptedConnectionsCount(response.data.count); // Update the count
        } else {
          console.error("Failed to fetch accepted connections.");
        }
      } catch (error) {
        console.error("Error fetching accepted connections:", error);
      }
    };

    if (userauthId) {
      fetchAcceptedConnections();
    }
  }, [userauthId]);

  useEffect(() => {
    const fetchAcceptedSponsors = async () => {
      try {
        const response = await axios.get("/api/accepted-sponsors", {
          params: { userauthId }, // Pass userauthId to fetch this community's accepted sponsor requests
        });
        setAcceptedSponsorCount(response.data.count);
      } catch (error) {
        console.error("Error fetching accepted sponsors:", error);
      }
    };

    if (userauthId) {
      fetchAcceptedSponsors();
    }
  }, [userauthId]);

  const handleSponsorRequest = async (receiverId) => {
    if (handleSelfRequestCheck("sponsor")) return;

    if (!agreedToTerms) {
      toast.error("Please agree to the sponsorship terms.");
      return;
    }

    try {
      const response = await axios.post("/api/sponsorrequest", {
        receiverId,
        status: "PENDING",
      });

      if (response.status === 201) {
        toast.success("Sponsor request sent successfully!");
        setIsSponsorModalOpen(false); // Close modal on success
      } else {
        toast.error("Failed to send sponsor request.");
      }
    } catch (error) {
      console.error("Error sending sponsor request:", error);
      toast.error("Failed to send sponsor request.");
    }
  };

  const toggleSponsorModal = () => {
    setIsSponsorModalOpen(!isSponsorModalOpen);
  };

  const handleTermsChange = (e) => {
    setAgreedToTerms(e.target.checked);
  };

  if (loading) {
    return (
      <div className=" mt-32 ">
        <Loding />
      </div>
    );
  }

  if (!community) {
    return (
      <p className=" text-3xl items-center flex  justify-center max-h-screen mt-16 text-center">
        No Community data available.
      </p>
    );
  }

  // Handle fullscreen mode for the Swiper
  const toggleFullScreen = () => {
    isFullScreen ? handleExitFullScreen() : handleFullScreen();
  };

  const handleFullScreen = () => {
    if (swiperRef.current) {
      const elem = swiperRef.current;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
      setIsFullScreen(true);
    }
  };

  const handleExitFullScreen = () => {
    if (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
    ) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullScreen(false);
    }
  };

  // Function to render image slides
  const renderImageSlides = (images) =>
    images.map((imageObj) =>
      imageObj.image.map((image, index) => (
        <SwiperSlide key={`${imageObj.id}-${index}`}>
          <img
            src={image} // Using the base64 image string directly
            alt={`Image ${index + 1}`}
            className="h-full w-full object-cover"
          />
        </SwiperSlide>
      ))
    );

  return (
    <div className="max-w-5xl mx-auto p-4 md:mt-24">
      <ToastContainer />
      <div className="flex flex-col md:flex-row">
        {/* Left: Image/Carousel Section */}
        <div className="w-full  md:w-2/3 relative">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {communityName}
          </h2>
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={10}
            slidesPerView={1}
            className="rounded-lg overflow-hidden"
            ref={swiperRef}
            onDoubleClick={toggleFullScreen}
          >
            {renderImageSlides(propertyImages)}
          </Swiper>
        </div>

        {/* Right: Profile and Actions Section */}
        <div className="w-full md:w-1/3 mt-4 md:mt-0 md:pl-4">
          <div className="text-center">
            {/* Company Logo */}
            <div className="mb-2  ">
              <img
                src={companyLogo}
                alt="Company Logo"
                className="w-36 h-28 mx-auto  rounded-lg  p-2 bg-gray-200 "
              />
            </div>

            {/* Profile Photo */}
            {community.userauth.UserProfile[0]?.profilePhoto ? (
              <div className="w-28 h-28 mb-2 mx-auto bg-gray-200 rounded-full overflow-hidden">
                <img
                  src={community.userauth.UserProfile[0].profilePhoto}
                  alt="Profile Photo"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-28 h-28 mb-2 mx-auto bg-gray-200 rounded-full overflow-hidden">
                <img
                  src="/assets/my_imgs/humanimage.png"
                  alt="Profile Photo"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* User Name */}
            {loggedInUserId ? (
              <>
                {/* User Name */}
                <h2
                  className="font-bold text-lg mt-2 text-blue-500 cursor-pointer"
                  onClick={toggleInfoVisibility}
                >
                  {community?.userauth?.fullName || userName}
                </h2>
              </>
            ) : (
              <>
                {/* Link to Sign In or Create Account */}
                <h2 className="font-bold  text-sm mt-2 text-blue-500">
                  <Link href="/signin" className="cursor-pointer">
                    Create Account / Sign In
                  </Link>
                </h2>
              </>
            )}

            {/* Additional Info Box */}
            {isInfoVisible && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white shadow-md rounded-lg p-6 w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] max-w-lg max-h-[80vh] overflow-auto relative">
                  {/* Close Button */}
                  <button
                    onClick={() => setIsInfoVisible(false)}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                  >
                    &times; {/* This is the "X" symbol for closing */}
                  </button>

                  {/* Modal Content */}
                  {community.userauth.UserProfile[0]?.jobTitle && (
                    <p className="text-gray-700 mb-2">
                      <strong>Job Title:</strong>{" "}
                      {community.userauth.UserProfile[0].jobTitle}
                    </p>
                  )}

                  {community.userauth.UserProfile[0]?.startedInIndustry && (
                    <p className="text-gray-700 mb-2">
                      <strong>Started in Industry:</strong>{" "}
                      {new Date(
                        community.userauth.UserProfile[0].startedInIndustry
                      ).toLocaleDateString()}
                    </p>
                  )}
                  {community.userauth.UserProfile[0]?.aboutYou && (
                    <p className="text-gray-700 mb-2">
                      <strong>About You:</strong>{" "}
                      {community.userauth.UserProfile[0].aboutYou}
                    </p>
                  )}
                  {community.userauth.UserProfile[0]?.education && (
                    <p className="text-gray-700 mb-2">
                      <strong>Education:</strong>{" "}
                      {community.userauth.UserProfile[0].education}
                    </p>
                  )}
                  {community.userauth.UserProfile[0]?.certificatesAndAwards
                    ?.length > 0 && (
                    <div className="text-gray-700 mb-2">
                      <strong>Certificates and Awards:</strong>
                      <div className="flex flex-wrap gap-4 mt-2">
                        {community.userauth.UserProfile[0].certificatesAndAwards.map(
                          (award, index) => (
                            <div
                              key={index}
                              className="w-24 h-24 overflow-hidden rounded-lg bg-gray-200"
                            >
                              <img
                                src={award} // Assuming 'award' is the image URL
                                alt={`Certificate or Award ${index + 1}`}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {community.userauth.UserProfile[0]?.jobTitle && (
              <p className="text-gray-600 text-sm">
                {community.userauth.UserProfile[0].jobTitle}
              </p>
            )}
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={toggleSponsorModal}
              className="w-full hover:bg-yellow-500 bg-gray-200 text-gray-700 py-2 rounded"
            >
              <span className="mr-2">
                <FaHandsHelping className="inline-block w-5 h-5" />
              </span>{" "}
              Sponsor: {acceptedSponsorCount}
            </button>
            <button
              className="w-full hover:bg-yellow-500 bg-gray-200 text-gray-700 py-2 rounded"
              onClick={() => handleConnectionRequest(community.userauthId)}
            >
              <span className="mr-2">💼</span> Connection :{" "}
              {acceptedConnectionsCount}
            </button>
            <button className="w-full hover:bg-yellow-500 bg-gray-200 text-gray-700 py-2 rounded">
              <Link target="_blank" href={website}>
                Visit Website
              </Link>
            </button>
            {/* Sponsor Button */}

            {/* Sponsor Modal */}
            {isSponsorModalOpen && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white shadow-md rounded-lg p-6 w-full  mt-10">
                  <h2 className="text-xl font-semibold mb-3">
                    Sponsorship Subscription Terms
                  </h2>
                  <p className="text-gray-700 mb-1">
                    The fee to sponsor{" "}
                    <span className="font-semibold">{communityName}</span> is{" "}
                    <span className="font-semibold">$85.00 per month</span>.
                    Payments for sponsorships are non-refundable. A minimum
                    duration of one year is required. Monthly and annual payment
                    discounts are available. All major credit cards and online
                    payments are accepted.
                  </p>
                  <p className="text-gray-700 mb-3">
                    Once a community accepts your sponsorship request, you will
                    be asked to confirm payment information.
                  </p>
                  <h2 className="text-xl font-semibold mb-3">
                    What Does Sponsoring a Community Mean?
                  </h2>
                  <p className="text-gray-700 mb-3">
                    When you sponsor a community and the community approves your
                    sponsorship, your business information will appear on that
                    community’s listing page along with any incentives you are
                    currently offering.
                  </p>
                  <h2 className="text-xl font-semibold mb-3">
                    Would You Like to Request Sponsorship?
                  </h2>
                  <div className="mb-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-red-600"
                        onChange={handleTermsChange}
                      />
                      <span className="ml-2">
                        I agree to the{" "}
                        <Link className=" text-blue-600" href={"/sponsorship"}>
                          sponsorship terms.
                        </Link>
                      </span>
                    </label>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleSponsorRequest(community.userauthId)}
                      className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 ${
                        !agreedToTerms ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={!agreedToTerms}
                    >
                      Send Request
                    </button>
                    <button
                      onClick={toggleSponsorModal}
                      className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            <button className="w-full hover:bg-yellow-500 bg-gray-200 text-gray-700 py-2 rounded">
              Share
            </button>
            <div className="flex justify-center max-h-screen space-x-4">
              {/* Facebook Icon */}

              <Link href={link1} target="_blank">
                <FaFacebook className="text-blue-600 hover:text-blue-800 w-6 h-6" />
              </Link>

              {/* Instagram Icon */}

              <Link href={link2} target="_blank">
                <FaInstagram className="text-pink-600 hover:text-pink-800 w-6 h-6" />
              </Link>

              <Link href={link3} target="_blank">
                <FaLinkedin className="text-blue-700 hover:text-blue-900 w-6 h-6" />
              </Link>

              {/* YouTube Icon */}

              <Link href={link4} target="_blank">
                <FaYoutube className="text-red-600 hover:text-red-800 w-6 h-6" />
              </Link>
            </div>

            {acceptedSponsorNames.length > 0 ? (
              <div className="mt-4">
                <h3 className="font-semibold md:px-16">Community Sponsors:</h3>
                <ul className="space-y-4">
                  {acceptedSponsorNames.map((sponsor, index) => (
                    <li
                      key={index}
                      className="flex flex-col items-center space-x-4"
                    >
                      {/* Display Image */}
                      {sponsor.image ? (
                        <img
                          src={sponsor.image}
                          alt={sponsor.name}
                          className="w-36 h-36  rounded-lg  object-fill pb-2 pt-2"
                        />
                      ) : (
                        <div className="w-28 h-28 rounded-full bg-gray-200"></div> // Placeholder if no image
                      )}
                      {/* Display Name */}
                      <span>{sponsor.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-4">No sponsors available yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Company Overview Section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          About Us {communityName}
        </h3>
        <p className="text-gray-600">{companyOverview}</p>
      </div>

      {/* More Information Section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          More Information
        </h3>
        <div className="space-y-2">
          {loggedInUserId && (
            <>
              <p>
                <strong>Address:</strong> {address}
              </p>
              <p>
                <strong>City:</strong> {city}
              </p>

              <p>
                <strong>State:</strong> {state}
              </p>
              <p>
                <strong>Zip:</strong> {zip}
              </p>
              <p>
                <strong>Phone:</strong> {phoneNumber}
              </p>
              <p>
                <strong>Cell Phone:</strong> {cellPhone}
              </p>
              <p>
                <strong>Fax:</strong> {faxNumber}
              </p>
              <p>
                <strong>License #:</strong> {licenseNumber}
              </p>
            </>
          )}

          <div>
            <strong>Amenities:</strong>
            <ul className="list-disc list-inside ml-4">
              {amenities.flat().map((amenity, index) => (
                <li key={index}>{amenity}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityData;
