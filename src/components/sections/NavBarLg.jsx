import {
  Activity,
  ChevronRight,
  House,
  LayoutDashboard,
  User,
  LogIn,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function NavBarLg({
  darkMode,
  setDarkMode,
  showDropList,
  setShowDropList,
}) {
  const navPatientLoggedIn = [
    { text: "Home", icon: House, link: "/" },
    { text: "My Dashboard", icon: LayoutDashboard, link: "/patient-dashboard" },
    { text: "Search For Doctors", icon: Activity, link: "/search" },
    { text: "My Profile", icon: User, link: "/patient-profile" },
  ];

  const navDoctorLoggedIn = [
    { text: "Home", icon: House, link: "/" },
    { text: "My Dashboard", icon: LayoutDashboard, link: "/doctor-dashboard" },
    { text: "Search For Doctors", icon: Activity, link: "/search" },
    { text: "My Profile", icon: User, link: "/doctor-profile" },
  ];

  const navNotLoggedIn = [
    { text: "Home", icon: House, link: "/" },
    { text: "Search For Doctors", icon: Activity, link: "/search" },
    { text: "Sign In", icon: LogIn, link: "/login" },
  ];

  // State for navigation array
  const [navArray, setNavArray] = useState(navNotLoggedIn);

  // Update navArray based on localStorage
  useEffect(() => {
    const userRole = localStorage.getItem("role");
    const loggedStatus = localStorage.getItem("loggedIn");

    if (loggedStatus === "true") {
      if (userRole.toLowerCase() === "doctor") {
        setNavArray(navDoctorLoggedIn);
      } else {
        setNavArray(navPatientLoggedIn);
      }
    } else {
      setNavArray(navNotLoggedIn);
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-gray/80 dark:border-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/">
              <h1 className="text-xl font-bold text-teal dark:text-light-teal">
                HealthConnect
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navArray.map((item, index) => (
              <Link
                to={item.link}
                key={index}
                className="hover:text-teal-700 dark:hover:text-light-teal transition-colors text-gray dark:text-white"
              >
                {item.text}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-gray dark:text-white p-2 rounded-md hover:text-teal dark:hover:text-light-teal transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
              🔔
            </button>

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md text-gray hover:text-teal dark:text-white dark:hover:text-light-teal transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            <button
              onClick={() => setShowDropList(!showDropList)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span className="text-gray dark:text-white">☰</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {showDropList && (
        <div className="lg:hidden animate-down bg-white dark:bg-gray border-t border-gray-200 dark:border-gray-600">
          {navArray.map((item, index) => (
            <Link to={item.link} key={index}>
              <div
                className="flex items-center justify-between p-4 font-medium border-b border-gray-200/50 dark:border-gray-600/50 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setShowDropList(false)}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    size={25}
                    className="text-teal dark:text-light-teal transition-colors"
                  />
                  <span className="text-base text-gray dark:text-white font-semibold transition-colors">
                    {item.text}
                  </span>
                </div>
                <ChevronRight
                  size={16}
                  className="text-gray-400 dark:text-gray-500 transition-colors"
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
