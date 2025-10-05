import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import img from "../assets/img.webp";
import Footer from "../components/Footer";
import ScrollToTop from "../components/other/ScrollToTop";
import CTASection from "../components/sections/CTASection";
import FaqSection from "../components/sections/FaqSection";
import NavBarLg from "../components/sections/NavBarLg";
import StatSection from "../components/sections/StatSection";
import TestimonialSection from "../components/sections/TestimonialSection";
import { features } from "../data/homePage";
export default function HealthConnectLanding({showDropList,setShowDropList}) {
  const loggedInside = localStorage.getItem("loggedIn");
  // logic for logging in !!!!!!
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(null);


  useEffect(() => {
    // Check for saved dark mode preference or system preference
    const savedDarkMode = localStorage.getItem("darkMode");
    const systemDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const shouldUseDarkMode = savedDarkMode
      ? JSON.parse(savedDarkMode)
      : systemDarkMode;

    if (shouldUseDarkMode) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <>
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-teal" : "bg-color"
      }`}
    >
      {/* Navigation */}
     <NavBarLg darkMode={darkMode} setDarkMode={setDarkMode} setShowDropList={setShowDropList} showDropList={showDropList}/>

      {/* Hero Section */}
      <section
        className={`relative overflow-hidden ${
          darkMode ? "bg-teal" : "bg-color"
        }`}
      >
        <div className="absolute inset-0 grid-pattern opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="text-center space-y-8">
            {/* Hero Image */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-light-teal/20 flex items-center justify-center">
                  <img
                    src={img}
                    alt="HealthConnect Logo"
                    className="w-20 h-20 lg:w-24 lg:h-24 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target;
                      target.style.display = "none";
                      target.innerHTML =
                        '<div class="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-teal flex items-center justify-center text-white text-3xl">🏥</div>';
                    }}
                  />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#E29578] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">📊</span>
                </div>
              </div>
            </div>

            {/* Hero Text */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-balance">
                <span className={`${darkMode ? "text-white" : "text-gray"}`}>
                  Your Health,
                </span>
                <br />
                <span
                  className={`${darkMode ? "text-light-teal" : "text-teal"}`}
                >
                  Our Priority
                </span>
              </h1>
              <p
                className={`text-lg lg:text-xl max-w-2xl mx-auto text-pretty ${
                  darkMode ? "text-white/80" : "text-gray"
                }`}
              >
                Connect with qualified doctors and manage your healthcare
                journey with ease. Experience the future of healthcare
                management.
              </p>
            </div>

            {/* Search Widget */}
            <div className="max-w-md mx-auto bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-sm dark:bg-white/95">
              <div className="p-6 space-y-4">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray">
                    🔍
                  </span>
                  <Link to="/search">
                  <input
                    type="text"
                    placeholder="Search for doctors, specialties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                  /></Link>
                </div>
                <button className="w-full bg-teal hover:bg-teal/90 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2">
                  <span>📍</span>
                  Find Doctor Near Me
                </button>
              </div>
            </div>

            {/* Join Buttons */}
            {loggedInside && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
                <button className="w-full sm:w-auto bg-[#E29578] hover:bg-[#E29578]/90 text-white px-8 py-2 rounded-md border-2 border-[#E29578] transition-colors">
                  Join as Patient
                </button>
                <button
                  className={`w-full sm:w-auto px-8 py-2 rounded-md bg-transparent border-2 transition-colors ${
                    darkMode
                      ? "border-light-teal text-light-teal hover:bg-light-teal hover:text-teal"
                      : "border-teal text-teal hover:bg-teal hover:text-white"
                  }`}
                >
                  Join as Doctor
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats"
        className={`py-12 lg:py-16 ${darkMode ? "bg-gray/20" : "bg-white/50"}`}
      >
        <StatSection darkMode={darkMode} />
      </section>

      {/* Features Section */}
      <section
        id="features"
        className={`py-16 lg:py-24 ${darkMode ? "bg-teal" : "bg-color"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <span className="inline-block bg-light-teal/20 text-teal hover:bg-light-teal/30 dark:bg-light-teal/20 dark:text-light-teal dark:hover:bg-light-teal/30 px-3 py-1 rounded-full text-sm font-medium">
              Why Choose Us
            </span>
            <h2
              className={`text-3xl lg:text-4xl font-bold ${
                darkMode ? "text-white" : "text-gray"
              }`}
            >
              Why choose HealthConnect?
            </h2>
            <p
              className={`text-lg max-w-2xl mx-auto ${
                darkMode ? "text-white/80" : "text-gray"
              }`}
            >
              Experience healthcare management like never before with our
              comprehensive platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-black group hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-teal/20 bg-white/90 dark:bg-white/95 rounded-lg"
              >
                <div className="p-8 text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-light-teal/20 flex items-center justify-center group-hover:bg-light-teal/30 transition-colors dark:bg-light-teal/20 dark:group-hover:bg-light-teal/30">
                      <span className="text-2xl">{feature.icon}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray/80 ">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className={`py-16 lg:py-24 ${darkMode ? "bg-gray/20" : "bg-white/50"}`}
      >
        <TestimonialSection darkMode={darkMode}/>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        className={`py-16 lg:py-24 ${darkMode ? "bg-teal" : "bg-color"}`}
      >
      
         
          <FaqSection setOpenFaq={setOpenFaq} openFaq={openFaq} darkMode={darkMode} />
      </section>

      {/* CTA Section */}
      {loggedInside && (
        <section className="py-16 lg:py-24 bg-teal text-white">
          <CTASection />
        </section>
      )}
      <Footer darkMode={darkMode} />
    </div>
    <ScrollToTop/>
    </>
  );
}
