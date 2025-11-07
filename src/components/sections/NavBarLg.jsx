import {
  Activity,
  ChevronRight,
  Home,
  LayoutDashboard,
  User,
  LogIn,
  LogOut,
  Bell,
  Moon,
  Sun,
  Menu,
  Stethoscope,
  X,
  Mail,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function NavBarLg({
  darkMode,
  setDarkMode,
  showDropList,
  setShowDropList,
}) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);

  // Reactive state
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [loggedStatus, setLoggedStatus] = useState(
    localStorage.getItem("loggedIn") === "true"
  );
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [patientId, setPatientId] = useState(localStorage.getItem("patientId"));
  const [doctorId, setDoctorId] = useState(localStorage.getItem("doctorId"));

  const handleSearchClick = (e, link) => {
    if (!loggedStatus && link === "/search") {
      e.preventDefault();
      setShowAuthModal(true);
      setShowDropList(false);
    } else {
      navigate(link);
      setShowDropList(false);
    }
  };

  const navPatientLoggedIn = [
    { text: "Home", icon: Home, link: "/" },
    { text: "Dashboard", icon: LayoutDashboard, link: "/patient-dashboard" },
    { text: "Search", icon: Activity, link: "/search" },
    { text: username, icon: User, link: `/patient/${patientId}/profile` },
  ];

  const navDoctorLoggedIn = [
    { text: "Home", icon: Home, link: "/" },
    { text: "Dashboard", icon: LayoutDashboard, link: "/doctor-dashboard" },
    { text: username, icon: User, link: `/doctor/${doctorId}/profile` },
  ];

  const navNotLoggedIn = [
    { text: "Home", icon: Home, link: "/" },
    { text: "Search", icon: Activity, link: "/search" },
    { text: "Sign In", icon: LogIn, link: "/login" },
  ];
  
  const [navArray, setNavArray] = useState(navNotLoggedIn);

  useEffect(() => {
    if (loggedStatus) {
      if (role?.toLowerCase() === "doctor") {
        setNavArray([...navDoctorLoggedIn, { text: "Logout", icon: LogOut }]);
      } else {
        setNavArray([...navPatientLoggedIn, { text: "Logout", icon: LogOut }]);
      }
    } else {
      setNavArray(navNotLoggedIn);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, loggedStatus, username, patientId, doctorId]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("userEmail");
    Cookies.remove("userRole");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("patientId");
    localStorage.removeItem("doctorId");
    localStorage.setItem("loggedIn", "false");
    setRole(null);
    setLoggedStatus(false);
    setUsername(null);
    setPatientId(null);
    setDoctorId(null);
    setNavArray(navNotLoggedIn);
    setShowDropList?.(false);
    navigate("/login");
  };

  useEffect(() => {
    const stored = (
      localStorage.getItem("role") ||
      Cookies.get("userRole") ||
      ""
    )
      .toString()
      .toUpperCase();
    setRole(stored || null);
    if (stored === "DOCTOR") setNavArray(navDoctorLoggedIn);
    else if (stored === "PATIENT") setNavArray(navPatientLoggedIn);
    else setNavArray(navNotLoggedIn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectGoogleAccount = () => {
    setShowGoogleChooser(false);
    navigate("/register");
  };

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 10px rgba(20, 184, 166, 0.3); }
          50% { box-shadow: 0 0 20px rgba(20, 184, 166, 0.5); }
        }
        .animate-slide-down { animation: slideDown 0.2s ease-out; }
        .animate-fade-in { animation: fadeIn 0.2s ease-out; }
        .animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-pulse-dot { animation: pulse 2s ease-in-out infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-glow { animation: glow 2s ease-in-out infinite; }
        .shimmer-effect {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>
      
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="relative animate-float">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg blur opacity-50 group-hover:opacity-75 animate-glow transition-opacity"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-600 dark:from-teal-400 dark:to-emerald-500 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 overflow-hidden">
                  <div className="absolute inset-0 shimmer-effect"></div>
                  <Stethoscope className="w-6 h-6 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" strokeWidth={2.5} />
                </div>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white group-hover:scale-105 transition-transform duration-300 hidden sm:inline">
                Health<span className="text-teal-600 dark:text-teal-400">Connect</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-4">
              {navArray.map((item, index) =>
                item.text === "Logout" ? (
                  <button
                    key={index}
                    onClick={handleLogout}
                    className="relative flex items-center gap-2.5 px-6 py-3 rounded-xl text-lg font-semibold text-gray-700 dark:text-gray-300 transition-all duration-200 overflow-hidden group hover:scale-105 hover:shadow-lg hover:bg-gradient-to-r hover:from-red-500 hover:via-rose-500 hover:to-red-600 hover:text-white"
                  >
                    <item.icon className="w-6 h-6 group-hover:rotate-12 transition-all duration-300" strokeWidth={2.5} />
                    <span>{item.text}</span>
                  </button>
                ) : (
                  <button
                    key={index}
                    onClick={(e) => handleSearchClick(e, item.link)}
                    className="relative flex items-center gap-2.5 px-6 py-3 rounded-xl text-lg font-semibold text-gray-700 dark:text-gray-300 transition-all duration-200 overflow-hidden group hover:scale-105 hover:shadow-lg hover:bg-gradient-to-r hover:from-mint-300 hover:via-teal-200 hover:to-emerald-300 hover:text-gray-900"
                  >
                    <item.icon className="w-6 h-6 group-hover:scale-110 transition-all duration-300" strokeWidth={2.5} />
                    <span>{item.text}</span>
                  </button>
                )
              )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3 ml-auto lg:ml-0">
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110 group"
                >
                  <Bell className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" strokeWidth={2.5} />
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse-dot shadow-lg shadow-red-500/50"></span>
                </button>

                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-40 animate-fade-in" onClick={() => setShowNotifications(false)}></div>
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 animate-scale-in">
                      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/40 rounded-lg flex items-center justify-center">
                            <Bell className="w-4 h-4 text-teal-600 dark:text-teal-400" strokeWidth={2.5} />
                          </div>
                          <span className="font-bold text-base text-gray-900 dark:text-white">Notifications</span>
                        </div>
                        <button onClick={() => setShowNotifications(false)} className="p-1.5 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                          <X className="w-4 h-4 text-gray-500" strokeWidth={2.5} />
                        </button>
                      </div>
                      <div className="p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center animate-float">
                          <Bell className="w-8 h-8 text-gray-400" strokeWidth={2} />
                        </div>
                        <p className="text-base font-bold text-gray-700 dark:text-gray-300">No new notifications</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">You're all caught up!</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Dark Mode */}
              <button
                onClick={toggleDarkMode}
                className="p-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110 group"
              >
                {darkMode ? <Sun className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" strokeWidth={2.5} /> : <Moon className="w-6 h-6 group-hover:-rotate-12 transition-transform duration-500" strokeWidth={2.5} />}
              </button>

              {/* Mobile Menu */}
              <button
                onClick={() => setShowDropList(!showDropList)}
                className="lg:hidden p-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110"
              >
                <Menu className="w-6 h-6" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Fixed with max-height and overflow */}
        {showDropList && (
          <div className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 animate-slide-down max-h-96 overflow-y-auto">
            <div className="px-2 py-2 space-y-0.5">
              {navArray.map((item, index) =>
                item.text === "Logout" ? (
                  <button
                    key={index}
                    onClick={() => {
                      handleLogout();
                      setShowDropList(false);
                    }}
                    className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 group hover:scale-[1.02]"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-red-50 dark:group-hover:bg-red-900/20 group-hover:scale-110 transition-all duration-300">
                        <item.icon className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 group-hover:rotate-12 transition-all duration-300" strokeWidth={2} />
                      </div>
                      <span className="text-sm font-medium">{item.text}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform duration-200" strokeWidth={2} />
                  </button>
                ) : (
                  <button
                    key={index}
                    onClick={(e) => {
                      handleSearchClick(e, item.link);
                      setShowDropList(false);
                    }}
                    className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-900/10 hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-200 group hover:scale-[1.02]"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-teal-50 dark:group-hover:bg-teal-900/20 group-hover:scale-110 transition-all duration-300">
                        <item.icon className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:scale-110 transition-all duration-300" strokeWidth={2} />
                      </div>
                      <span className="text-sm font-medium">{item.text}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform duration-200" strokeWidth={2} />
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      {showAuthModal && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowAuthModal(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/30 dark:to-emerald-900/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">Sign in required</h2>
                    <p className="text-base text-gray-600 dark:text-gray-400 mt-1">Please sign in to search for doctors</p>
                  </div>
                  <button onClick={() => setShowAuthModal(false)} className="p-2 hover:bg-white/60 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-200 hover:rotate-90">
                    <X className="w-6 h-6 text-gray-500" strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Email Sign In */}
                <button
                  onClick={() => {
                    setShowAuthModal(false);
                    navigate("/login");
                  }}
                  className="w-full flex items-center justify-center gap-2 px-5 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 dark:from-teal-500 dark:to-emerald-500 dark:hover:from-teal-600 dark:hover:to-emerald-600 rounded-xl font-bold text-base text-white transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl group"
                >
                  <Mail className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" strokeWidth={2.5} />
                  Sign in with Email
                </button>

                {/* Sign Up Link */}
                <p className="text-center text-base text-gray-600 dark:text-gray-400">
                  Don't have an account?{" "}
                  <button
                    onClick={() => {
                      setShowAuthModal(false);
                      navigate("/register");
                    }}
                    className="font-bold text-teal-600 dark:text-teal-400 hover:underline hover:scale-105 inline-block transition-transform duration-200"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Google Account Chooser Modal */}
      {showGoogleChooser && (
        <>
          <div className="fixed inset-0 bg-gray-100 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scale-in" onClick={(e) => e.stopPropagation()}>
              {/* Google Logo */}
              <div className="flex justify-center mb-8">
                <svg className="w-12 h-12" viewBox="0 0 24 24">
                  <text x="3" y="20" fontSize="24" fontWeight="bold" fill="#4285F4">G</text>
                </svg>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Choose an account</h1>

              {/* Account List - Placeholder */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={handleSelectGoogleAccount}
                  className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 border border-gray-200 transition-all hover:border-gray-300 text-left group"
                >
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                    A
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Account</p>
                    <p className="text-sm text-gray-600">account@example.com</p>
                  </div>
                </button>
              </div>

              {/* Use Another Account Button */}
              <button className="w-full flex items-center justify-center gap-2 p-4 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Use another account
              </button>

              <p className="text-center text-xs text-gray-600 mt-6">English (United States)</p>
            </div>
          </div>
        </>
      )}
    </>
  );
}