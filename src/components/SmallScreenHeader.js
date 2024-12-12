import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi"; // React Icons for Hamburger and Close icons
import axios from "axios"; // For API calls
import logo from "../assets/mobilelogo.png";
import Image from "next/image";
const links = [
  { href: "/", text: "Home" },
  { href: "/properties-list", text: "Communities" },
  { href: "/agent-list", text: "Agents" },
  { href: "/contact", text: "Contact" },
];

export default function SmallScreenHeader() {
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false); // Manage navbar collapse state
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track user authentication
  const [userType, setUserType] = useState(null); // Store the user type
  const [userId, setUserId] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  // Toggle navbar open/close
  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  // Fetch user authentication status and user type
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

  return (
    <div className=" bg-[#0a73c0] shadow-lg p-2">
      <div className=" flex justify-between items-center pr-6  border-b">
        <Image
          src={logo}
          alt="Company Logo"
          width={146}
          height={146}
          className=" h-12 pt-2 object-contain"
        />
        <button onClick={toggleNavbar} aria-label="Toggle navigation">
          {isOpen ? (
            <FiX className="text-2xl text-white" /> // Close icon
          ) : (
            <FiMenu className="text-2xl text-white" /> // Hamburger icon
          )}
        </button>
      </div>

      {/* Navbar Links, only shown if navbar is open */}
      <div className={`${isOpen ? "block" : "hidden"} mt-4`}>
        <ul className="navbar-nav space-y-4">
          {links.map((link) => (
            <li className="nav-item" key={link.href}>
              <Link
                className={`nav-link block px-4 py-2 text-white ${
                  path === link.href ? "font-bold" : "font-normal"
                }`}
                href={link.href}
              >
                {link.text}
              </Link>
            </li>
          ))}
        </ul>

        {/* Button Section */}
        <div className="mobile-buttons mt-6 px-4">
          {isAuthenticated ? (
            <>
              {/* Profile Button */}
              <Link
                href="/logout"
                className="btn btn-primary btn-login hstack gap-2"
              >
                <i className="fa-solid fa-user"></i>
                <span className="">logout</span>
              </Link>

              {/* Dashboard Link based on user type */}
              {userType === "AGENT" ? (
                <>
                  <Link
                    href="/agent-dashboard"
                    className="block w-full bg-blue-500 text-white text-center py-2 rounded mt-2"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href={`/agent-detail/${userDetails?.agentBusinessInfos?.[0]?.id}`} // Check if userDetails and agentBusinessInfos exist
                    className="btn btn-primary btn-login hstack gap-2"
                  >
                    <i className="fa-solid fa-user"></i>
                    <p className=" ">Profile view</p>
                  </Link>
                </>
              ) : userType === "COMMUNITY_MEMBER" ? (
                <>
                  <Link
                    href="/community-dashboard"
                    className="block w-full bg-blue-500 text-white text-center py-2 rounded mt-2"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href={`/community-details/${userDetails?.communityBusinessinfos?.[0]?.id}`} // Check if userDetails and communityBusinessinfos exist
                    className="btn btn-primary btn-login hstack gap-2"
                  >
                    <i className="fa-solid fa-user"></i>
                    <span className="">Profile view</span>
                  </Link>
                </>
              ) : null}
            </>
          ) : (
            <Link
              href="/signin"
              className="block w-full bg-blue-500 text-white text-center py-2 rounded"
            >
              Login / Signup
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
