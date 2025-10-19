import { Filter, Search, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DoctorCard from "../components/DoctorCard";
import ScrollToTop from "../components/other/ScrollToTop";
import NavBarLg from "../components/sections/NavBarLg";
import Cookies from "js-cookie";

const specialties = [
  "All",
  "Cardiology",
  "General Medicine",
  "Pediatrics",
  "Dermatology",
  "Neuro-Op",
];

export default function DoctorSearchPage({
  darkMode,
  setDarkMode,
  setShowDropList,
  showDropList,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  useEffect(() => {}, []);
  const navigate = useNavigate();

  const handleSearch = (query) => {
    setSearchQuery(query);
    filterDoctors(query, selectedSpecialty);
  };

  const handleSpecialtyFilter = (specialty) => {
    setSelectedSpecialty(specialty);
    filterDoctors(searchQuery, specialty);
  };

  const filterDoctors = (query, specialty) => {
    let filtered = [];

    if (query) {
      filtered = filtered.filter(
        (doctor) =>
          doctor.fullName.toLowerCase().includes(query.toLowerCase()) ||
          doctor.specialties.some((s) =>
            s.name.toLowerCase().includes(query.toLowerCase())
          )
      );
    }

    if (specialty !== "All") {
      filtered = filtered.filter((doctor) =>
        doctor.specialties.some((s) => s.name === specialty)
      );
    }

    setFilteredDoctors(filtered);
  };

  const handleViewProfile = (doctor) => {
    console.log("View profile for:", doctor.fullName);
  };

  const handleBookNow = (doctor) => {
    console.log("handleBookNow called, doctor:", doctor);
    if (!doctor || !doctor.id) {
      console.warn("No doctor or id present — cannot navigate");
      return;
    }
    // use a specific route — change to your booking route
    const Docname=localStorage.set("Docname");
    navigate(`/book/${doctor.id}`);
  };
  const handleKeyDown = async (event) => {
    if (event.key !== "Enter") return;
    const query = (event.target && event.target.value) || searchQuery;
    const q = query.trim();
    if (!q) return;

    try {
      // prefer using URLSearchParams for safety
      const token = Cookies.get("token");
      const param = new URLSearchParams({ text: q }).toString();

      const res = await fetch(
        `http://localhost:8080/api/users/doctors/search?${param}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },

          credentials: "include",
        }
      );
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      console.log("Search results:", data);

      // common API shapes:
      // 1) array returned directly -> data
      // 2) wrapped -> { results: [...]} or { doctors: [...] }
      const doctors = Array.isArray(data)
        ? data
        : data.results || data.doctors || [];

      // update UI with results
      setFilteredDoctors(doctors);

      // reset speciality filter if you want to show all results
      // setSelectedSpecialty("All");
    } catch (error) {
      console.error("Error fetching doctors:", error);
      // optionally setFilteredDoctors([]) or show error state
    }
  };

  return (
    <>
      <NavBarLg
        setShowDropList={setShowDropList}
        showDropList={showDropList}
        setDarkMode={setDarkMode}
        darkMode={darkMode}
      />
      <div className="min-h-screen pt-8" style={{ backgroundColor: "#edf6f9" }}>
        <div className="flex items-center justify-between p-4 pt-8">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#83c5be" }}
            >
              <User className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold" style={{ color: "#006d77" }}>
              Find Doctor
            </h1>
          </div>
        </div>

        <div className="px-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors, specialties..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-12 py-3 rounded-xl border-0 bg-white shadow-sm"
              onKeyDown={handleKeyDown}
            />
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-lg px-3 py-2 text-white"
              style={{ backgroundColor: "#006d77" }}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="px-4 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {specialties.map((specialty) => (
              <button
                key={specialty}
                onClick={() => handleSpecialtyFilter(specialty)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
                  selectedSpecialty === specialty
                    ? "text-white"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }`}
                style={
                  selectedSpecialty === specialty
                    ? { backgroundColor: "#006d77" }
                    : {}
                }
              >
                {specialty}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between px-4 mb-4">
          <p className="text-sm text-gray-600">
            {filteredDoctors.length} doctors found
          </p>
          <button className="text-sm" style={{ color: "#006d77" }}>
            Sort by Rating
          </button>
        </div>
        {filteredDoctors.length === 0 ? (
          <div className=" w-full py-50 text-center text-3xl">
            {" "}
            Oops, No Doctors Found
          </div>
        ) : null}
        <div className="px-4 space-y-4">
          {filteredDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onViewProfile={handleViewProfile}
              onBookNow={handleBookNow}
            />
          ))}
        </div>

        <div className="h-8"></div>
      </div>
      <ScrollToTop />
    </>
  );
}
