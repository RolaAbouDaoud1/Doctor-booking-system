import { Activity, House, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer({ darkMode }) {
  const footerData = [
    { text: "Home", icon: House, link: "/" },
    { text: "My Dashboard", icon: House, link: "/dashboard" },
    { text: "Search For Doctors", icon: Activity, link: "/search" },
    { text: "Sign in", icon: User, link: "/login" },
  ]; const navigateData = [
    { text: "Features", icon: House, link: "#features" },
    { text: "testimonials", icon: House, link: "#testimonials" },
    { text: "faq", icon: Activity, link: "#faq" },
    { text: "More", icon: User, link: "#stats" },
  ];

  return (
    <footer
      id="contact"
      className={`${
        darkMode ? "bg-gray" : "bg-white"
      } border-t border-gray-200 dark:bg-gray dark:border-gray-600`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Infooowowowo */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-teal dark:text-light-teal">
              HealthConnect
            </h3>
            <p className={`${darkMode ? "text-white/80" : "text-gray/80"}`}>
              Connecting patients with healthcare providers for a healthier
              tomorrow.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className={`${
                  darkMode
                    ? "text-white/70 hover:text-light-teal"
                    : "text-gray/70 hover:text-teal"
                } transition-colors`}
              >
                Facebook
              </a>
              <a
                href="#"
                className={`${
                  darkMode
                    ? "text-white/70 hover:text-light-teal"
                    : "text-gray/70 hover:text-teal"
                } transition-colors`}
              >
                Twitter
              </a>
              <a
                href="#"
                className={`${
                  darkMode
                    ? "text-white/70 hover:text-light-teal"
                    : "text-gray/70 hover:text-teal"
                } transition-colors`}
              >
                Instagram
              </a>
             
            </div>
          </div>

          {/* Quick links */}
          <div className="gap-0.75 flex flex-col items-start justify-center">
            <h4
              className={`font-semibold ${
                darkMode ? "text-white" : "text-gray"
              }`}
            >
              Quick Links
            </h4>
            {footerData.map((item, index) => {
              return (
                <Link to={item.link}>
                  <h1
                    key={index}
                    className={`hover:text-teal-500 ${
                      darkMode
                        ? "text-white/80 hover:text-light-teal"
                        : "text-gray/80 hover:text-teal"
                    } transition-colors`}
                  >
                    {item.text}
                  </h1>
                </Link>
              );
            })}
            {/*Navigate */}
          </div>
           <div className="gap-0.75 flex flex-col items-start justify-center">
            <h4
              className={`font-semibold ${
                darkMode ? "text-white" : "text-gray"
              }`}
            >
              Navigate
            </h4>
            {navigateData.map((item, index) => {
              return (
                <a href={item.link}>
                  <h1
                    key={index}
                    className={`hover:text-teal-500 ${
                      darkMode
                        ? "text-white/80 hover:text-light-teal"
                        : "text-gray/80 hover:text-teal"
                    } transition-colors`}
                  >
                    {item.text}
                  </h1>
                </a>
              );
            })}
          </div>

          {/* Info */}
          <div className="space-y-4">
            <h4
              className={`font-semibold ${
                darkMode ? "text-white" : "text-gray"
              }`}
            >
              Contact Us
            </h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span
                  className={`${darkMode ? "text-white/70" : "text-gray/70"}`}
                >
                  📞
                </span>
                <span
                  className={`${darkMode ? "text-white/80" : "text-gray/80"}`}
                >
                  +1 (555) 123-4567
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`${darkMode ? "text-white/70" : "text-gray/70"}`}
                >
                  ✉️
                </span>
                <span
                  className={`${darkMode ? "text-white/80" : "text-gray/80"}`}
                >
                  support@healthconnect.com
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`${darkMode ? "text-white/70" : "text-gray/70"}`}
                >
                  📍
                </span>
                <span
                  className={`${darkMode ? "text-white/80" : "text-gray/80"}`}
                >
                  123MEOW Health St, Medical City
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 text-center dark:border-gray-600">
          <p className={`${darkMode ? "text-white/70" : "text-gray/70"}`}>
            © 2025 HealthConnect. All rights reserved :)
          </p>
        </div>
      </div>
    </footer>
  );
}
