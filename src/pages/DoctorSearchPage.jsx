import { Filter, Search, User } from "lucide-react"
import { useEffect, useState } from "react"
import DoctorCard from "../components/DoctorCard"
import ScrollToTop from "../components/other/ScrollToTop"
import NavBarLg from "../components/sections/NavBarLg"

const mockDoctors = [
  {
    id: 1,
    fullName: "Dr. Layla Khoury",
    avgRating: 4.9,
    reviewsCount: 156,
    specialties: [{ name: "Cardiology", isMajor: true, yearsOfExperience: 12 }],
    yearsOfExperience: 15,
    clinicLocation: { type: "Point", coordinates: [35.4822, 33.2736] },
    languages: ["Arabic", "English", "French"],
    distance: "2.5 km away",
    nextAvailable: "Today 3:00 PM",
    price: "$150",
    initials: "LK",
  },
  {
    id: 2,
    fullName: "Dr. Omar Khalil",
    avgRating: 4.7,
    reviewsCount: 89,
    specialties: [{ name: "General Medicine", isMajor: true, yearsOfExperience: 8 }],
    yearsOfExperience: 8,
    clinicLocation: { type: "Point", coordinates: [35.4922, 33.2836] },
    languages: ["Arabic", "English"],
    distance: "1.8 km away",
    nextAvailable: "Tomorrow 10:00 AM",
    price: "$120",
    initials: "OK",
  },
  {
    id: 3,
    fullName: "Dr. Nour Abdallah",
    avgRating: 4.8,
    reviewsCount: 203,
    specialties: [{ name: "Pediatrics", isMajor: true, yearsOfExperience: 10 }],
    yearsOfExperience: 12,
    clinicLocation: { type: "Point", coordinates: [35.5022, 33.2936] },
    languages: ["Arabic", "English"],
    distance: "3.2 km away",
    nextAvailable: "Today 5:00 PM",
    price: "$140",
    initials: "NA",
  },
]

const specialties = ["All", "Cardiology", "General Medicine", "Pediatrics", "Dermatology"]

export default function DoctorSearchPage({ darkMode, setDarkMode,setShowDropList,showDropList }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("All")
  const [filteredDoctors, setFilteredDoctors] = useState(mockDoctors)

  useEffect(()=>{fetch("http://localhost:8080/api/users/doctor/").then(res=>res.json()).then(data=>console.log(data))},[])

  const handleSearch = (query) => {
    setSearchQuery(query)
    filterDoctors(query, selectedSpecialty)
  }

  const handleSpecialtyFilter = (specialty) => {
    setSelectedSpecialty(specialty)
    filterDoctors(searchQuery, specialty)
  }

  const filterDoctors = (query, specialty) => {
    let filtered = mockDoctors

    if (query) {
      filtered = filtered.filter(
        (doctor) =>
          doctor.fullName.toLowerCase().includes(query.toLowerCase()) ||
          doctor.specialties.some((s) => s.name.toLowerCase().includes(query.toLowerCase())),
      )
    }

    if (specialty !== "All") {
      filtered = filtered.filter((doctor) => doctor.specialties.some((s) => s.name === specialty))
    }

    setFilteredDoctors(filtered)
  }

  const handleViewProfile = (doctor) => {
    console.log("View profile for:", doctor.fullName)
  }

  const handleBookNow = (doctor) => {
    console.log("Book appointment with:", doctor.fullName)
  }

  return (
    <>
    <NavBarLg setShowDropList={setShowDropList} showDropList={showDropList} setDarkMode={setDarkMode} darkMode={darkMode}/>
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
                selectedSpecialty === specialty ? "text-white" : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
              style={selectedSpecialty === specialty ? { backgroundColor: "#006d77" } : {}}
            >
              {specialty}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between px-4 mb-4">
        <p className="text-sm text-gray-600">{filteredDoctors.length} doctors found</p>
        <button className="text-sm" style={{ color: "#006d77" }}>
          Sort by Rating
        </button>
      </div>

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
    <ScrollToTop/>
    </>
  )
}
