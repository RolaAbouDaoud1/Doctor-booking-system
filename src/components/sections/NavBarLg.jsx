import {
  Activity,
  ChevronRight,
  Home,
  LayoutDashboard,
  User,
  LogIn,
  LogOut,
  Bell,
  Sun,
  Moon,
  Menu,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";

export default function NavBarLg({ darkMode, setDarkMode, showDropList, setShowDropList }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState(0);

  // Reactive state
  const [role, setRole] = useState(null);
  const [loggedStatus, setLoggedStatus] = useState(false);
  const [username, setUsername] = useState("John Doe");
  const [patientId, setPatientId] = useState("123");
  const [doctorId, setDoctorId] = useState("456");

  const navArray = useMemo(() => {
    if (loggedStatus) {
      if (role?.toLowerCase() === "doctor") {
        return [
          { text: "Home", icon: Home, link: "/" },
          { text: "My Dashboard", icon: LayoutDashboard, link: "/doctor-dashboard" },
          { text: "View Appointments", icon: Activity, link: "/doctor-dashboard" },
          { text: username ?? "Doctor", icon: User, link: `/doctor/${doctorId}/profile` },
          { text: "Logout", icon: LogOut },
        ];
      }

      return [
        { text: "Home", icon: Home, link: "/" },
        { text: "My Dashboard", icon: LayoutDashboard, link: "/patient-dashboard" },
        { text: "Search For Doctors", icon: Activity, link: "/search" },
        { text: username ?? "Patient", icon: User, link: `/patient/${patientId}/profile` },
        { text: "Logout", icon: LogOut },
      ];
    }

    return [
      { text: "Home", icon: Home, link: "/" },
      { text: "Search For Doctors", icon: Activity, link: "/search" },
      { text: "Sign In", icon: LogIn, link: "/login" },
    ];
  }, [role, loggedStatus, username, patientId, doctorId]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLogout = () => {
    setRole(null);
    setLoggedStatus(false);
    setUsername(null);
    setPatientId(null);
    setDoctorId(null);
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${
      scrolled 
        ? darkMode
          ? "bg-slate-900/95 backdrop-blur-2xl shadow-xl shadow-teal-500/5 border-b border-slate-700/50"
          : "bg-white/95 backdrop-blur-2xl shadow-xl shadow-teal-500/10 border-b border-gray-200/50"
        : darkMode
          ? "bg-slate-900/80 backdrop-blur-md border-b border-slate-800"
          : "bg-white/80 backdrop-blur-md border-b border-gray-200"
    }`}>
      {/* Gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-teal-500 to-transparent opacity-70"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-all duration-500"></div>
              <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <span className="text-white text-xl font-bold">🏥</span>
              </div>
            </div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              HealthConnect
            </h1>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navArray.map((item, index) =>
              item.text === "Logout" ? (
                <button
                  key={index}
                  onClick={handleLogout}
                  onMouseEnter={() => setActiveLink(index)}
                  className={`relative px-5 py-2.5 rounded-xl font-medium transition-all duration-300 group ${
                    activeLink === index
                      ? darkMode
                        ? "text-teal-400"
                        : "text-teal-600"
                      : darkMode
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <item.icon size={18} className={activeLink === index ? "rotate-12 scale-110" : ""} style={{transition: "all 0.3s"}} />
                    <span>{item.text}</span>
                  </span>
                  <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                    activeLink === index
                      ? darkMode
                        ? "bg-teal-500/10 scale-100"
                        : "bg-teal-50 scale-100"
                      : "scale-0"
                  }`}></div>
                </button>
              ) : (
                <a
                  href={item.link}
                  key={index}
                  onMouseEnter={() => setActiveLink(index)}
                  className={`relative px-5 py-2.5 rounded-xl font-medium transition-all duration-300 group ${
                    activeLink === index
                      ? darkMode
                        ? "text-teal-400"
                        : "text-teal-600"
                      : darkMode
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <item.icon size={18} className={activeLink === index ? "rotate-12 scale-110" : ""} style={{transition: "all 0.3s"}} />
                    <span>{item.text}</span>
                  </span>
                  <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                    activeLink === index
                      ? darkMode
                        ? "bg-teal-500/10 scale-100"
                        : "bg-teal-50 scale-100"
                      : "scale-0"
                  }`}></div>
                </a>
              )
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <button className={`relative p-3 rounded-xl transition-all duration-300 group ${
              darkMode
                ? "hover:bg-slate-800 text-gray-300 hover:text-teal-400"
                : "hover:bg-gray-100 text-gray-600 hover:text-teal-600"
            }`}>
              <Bell size={20} className="group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`relative p-3 rounded-xl transition-all duration-500 overflow-hidden group ${
                darkMode
                  ? "bg-gradient-to-br from-slate-800 to-slate-700 text-yellow-400"
                  : "bg-gradient-to-br from-gray-100 to-gray-200 text-slate-700"
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
              {darkMode ? (
                <Sun size={20} className="relative z-10 group-hover:rotate-180 transition-transform duration-500" />
              ) : (
                <Moon size={20} className="relative z-10 group-hover:rotate-180 transition-transform duration-500" />
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowDropList(!showDropList)}
              className={`lg:hidden p-3 rounded-xl transition-all duration-300 ${
                darkMode
                  ? "hover:bg-slate-800 text-gray-300"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <Menu size={22} className={`transition-all duration-300 ${showDropList ? "rotate-90" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showDropList && (
        <div className={`lg:hidden border-t overflow-hidden ${
          darkMode
            ? "bg-slate-900/98 backdrop-blur-xl border-slate-800"
            : "bg-white/98 backdrop-blur-xl border-gray-200"
        }`}>
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            {navArray.map((item, index) =>
              item.text === "Logout" ? (
                <button
                  key={index}
                  onClick={() => {
                    handleLogout();
                    setShowDropList(false);
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 group ${
                    darkMode
                      ? "hover:bg-slate-800 text-gray-300 hover:text-teal-400"
                      : "hover:bg-gray-50 text-gray-700 hover:text-teal-600"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg transition-all duration-300 ${
                      darkMode ? "bg-slate-800 group-hover:bg-teal-500/10" : "bg-gray-100 group-hover:bg-teal-50"
                    }`}>
                      <item.icon size={22} className="group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                    <span className="font-semibold">{item.text}</span>
                  </div>
                </button>
              ) : (
                <a
                  href={item.link}
                  key={index}
                  onClick={() => setShowDropList(false)}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 group ${
                    darkMode
                      ? "hover:bg-slate-800 text-gray-300 hover:text-teal-400"
                      : "hover:bg-gray-50 text-gray-700 hover:text-teal-600"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg transition-all duration-300 ${
                      darkMode ? "bg-slate-800 group-hover:bg-teal-500/10" : "bg-gray-100 group-hover:bg-teal-50"
                    }`}>
                      <item.icon size={22} className="group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                    <span className="font-semibold">{item.text}</span>
                  </div>
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
}