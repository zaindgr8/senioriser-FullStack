"use client";
import logo from "../assets/whitelogo.png";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios"; // Axios to call the API
import SmallScreenHeader from "./SmallScreenHeader"; // Import the SmallScreenHeader

const links = [
  { href: "/", text: "Home" },
  { href: "/properties-list", text: "Communities" },
  { href: "/agent-list", text: "Providers" },
  { href: "/contact", text: "Contact" },
];

export default function Header() {
  const [hasLogo, setHasLogo] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state
  const [userType, setUserType] = useState(null); // Store user type
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const [userId, setUserId] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);
  const path = usePathname();

  // Detect screen size and update the state
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 768); // Set to true for large screens (>=768px)
    };

    // Initial check for screen size
    handleResize();

    // Add event listener to monitor window resizing
    window.addEventListener("resize", handleResize);

    // Cleanup event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scroll = window.scrollY;
      if (scroll >= 81) {
        setHasLogo(true);
      } else {
        setHasLogo(false);
      }
    };

    // Scroll event to toggle logo visibility
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Fetch user authentication and user type
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get("/api/getcookes");
        if (response.data.user) {
          setIsAuthenticated(true);
          setUserType(response.data.user.userType); // Assuming the user type is returned as userType
          setUserId(response.data.user.id);
        }
      } catch (error) {
        setIsAuthenticated(false); // If there's an error, user is not authenticated
        setUserType(null);
      }
    };

    checkAuthentication();
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (userId) {
          const response = await fetch(`/api/getuserdetail?id=${userId}`); // Correctly use the userId
          const data = await response.json();

          if (response.ok) {
            setUserDetails(data);
          } else {
            setError(data.message || "Error fetching user details");
          }
        }
      } catch (error) {
        setError("Failed to fetch user details");
      }
    };

    if (userId) {
      fetchUserDetails(); // Fetch user details only if userId is available
    }
  }, [userId]);

  // Conditionally render based on screen size
  if (!isLargeScreen) {
    return <SmallScreenHeader />; // Render SmallScreenHeader on small screens
  }

  return (
    <>
      <div className="bg-primary text-white hidden lg:block">
        <Image
          src={logo}
          alt="Company Logo"
          width={146}
          height={146}
          className=" h-36 object-contain"
        />
      </div>

      <div
        className={
          hasLogo
            ? "has-logo navbar-wrap sticky-top"
            : "no-logo navbar-wrap sticky-top"
        }
      >
        <div className="container-lg hidden lg:block  md:block nav-container position-relative">
          <nav className="navbar navbar-expand-lg flex justify-between">
            <div id="navbarSupportedContent">
              <ul className="navbar-nav">
                {links.map((link) => (
                  <li className="nav-item" key={link.href}>
                    <Link
                      className={`nav-link ${
                        path === link.href ? "active" : ""
                      }`}
                      href={link.href}
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="d-flex gap-1 ms-lg-5">
              {isAuthenticated ? (
                <>
                  {/* Conditionally render based on userType */}
                  {userType === "AGENT" ? (
                    <>
                      <Link
                        href="/agent-listing"
                        className="btn btn-primary btn-login hstack gap-2"
                      >
                        <i className="fa-solid fa-user"></i>
                        <span className="d-none d-sm-inline-block">
                          Dashboard
                        </span>
                      </Link>
                      <Link
                        href={`/agent-detail/${userDetails?.agentBusinessInfos?.[0]?.id}`} // Check if userDetails and agentBusinessInfos exist
                        className="btn btn-primary btn-login hstack gap-2"
                      >
                        <i className="fa-solid fa-user"></i>
                        <span className="d-none d-sm-inline-block">
                          Profile view
                        </span>
                      </Link>
                    </>
                  ) : userType === "COMMUNITY_MEMBER" ? (
                    <>
                      <Link
                        href="/community-listing"
                        className="btn btn-primary btn-login hstack gap-2"
                      >
                        <i className="fa-solid fa-user"></i>
                        <span className="d-none d-sm-inline-block">
                          Dashboard
                        </span>
                      </Link>
                      <Link
                        href={`/community-details/${userDetails?.communityBusinessinfos?.[0]?.id}`} // Check if userDetails and communityBusinessinfos exist
                        className="btn btn-primary btn-login hstack gap-2"
                      >
                        <i className="fa-solid fa-user"></i>
                        <span className="d-none d-sm-inline-block">
                          Profile view
                        </span>
                      </Link>
                    </>
                  ) : null}
                  <Link
                    href="/logout"
                    className="btn btn-primary btn-login hstack gap-2"
                  >
                    <i className="fa-solid fa-user"></i>
                    <span className="d-none d-sm-inline-block">logout</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    className="btn gap-3 btn-primary btn-login hstack"
                  >
                    <span className="d-none d-sm-inline-block">Login</span>
                  </Link>
                  <Link
                    href="/signup"
                    className="btn gap-3 btn-primary btn-login hstack"
                  >
                    <span className="d-none d-sm-inline-block">Signup</span>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
