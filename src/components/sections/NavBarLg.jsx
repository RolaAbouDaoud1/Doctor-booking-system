import { Activity, ChevronRight, House, User } from "lucide-react";
import { LayoutDashboard } from 'lucide-react';
import { Link } from "react-router-dom";
export default function NavBarLg({
  darkMode,
  setDarkMode,
  showDropList,
  setShowDropList,
}) {
  const navPatientLg = [
    { text: "Home", icon: House, link: "/" },
    { text: "My Dashboard", icon: LayoutDashboard, link: "/dashboard" },
    { text: "Search For Doctors", icon: Activity, link: "/search" },
    { text: "Sign in", icon: User, link: "/login" },
  ];

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    //css html
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
          {/* For lG Screens*/}
          <div className="hidden lg:flex items-center space-x-8">
            {navPatientLg.map((item, index) => {
              return (
                <Link to={item.link} key={index + 100}>
                  <h1 className="hover:text-teal-700">{item.text}</h1>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-gray dark:text-white p-2 rounded-md text-gray hover:text-teal dark:hover:text-light-teal transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
              🔔
            </span>

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
      {showDropList &&
        navPatientLg.map((item, index) => {
          return (
            <Link to={item.link}>
              <div
                className=" animate-down flex items-center justify-between p-4 font-medium border-b border-neutral-800/50 last:border-b-0"
                onClick={() => setShowDropList(false)}
                key={index}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    size={25}
                    className={` text-teal transition-colors`}
                  />
                  <span className="text-base text-gray font-semibold transition-colors">
                    {item.text}
                  </span>
                </div>
                <ChevronRight
                  size={16}
                  className="text-neutral-500 transition-colors"
                />
              </div>
            </Link>
          );
        })}
    </nav>
  );
  /*(
        <div className="lg:hidden animate-down bg-white border-t border-gray-200 dark:bg-gray dark:border-gray-600">
          <div className="px-4 py-2 space-y-2">
            <a
              href="#features"
              className="block py-2 text-gray hover:text-teal dark:text-white dark:hover:text-light-teal"
              onClick={() => setShowDropList(false)}
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="block py-2 text-gray hover:text-teal dark:text-white dark:hover:text-light-teal"
              onClick={() => setShowDropList(false)}
            >
              Testimonials
            </a>
            <a
              href="#faq"
              className="block py-2 text-gray hover:text-teal dark:text-white dark:hover:text-light-teal"
              onClick={() => setShowDropList(false)}
            >
              FAQ
            </a>
            <a
              href="#contact"
              className="block py-2 text-gray hover:text-teal dark:text-white dark:hover:text-light-teal"
              onClick={() => setShowDropList(false)}
            >
              Contact
            </a>
          </div>
        </div>
      ) */
}
