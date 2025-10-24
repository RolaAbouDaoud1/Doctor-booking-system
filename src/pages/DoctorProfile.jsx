"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "./DoctorProfile.css"
import DoctorHeader from "../components/DoctorHeader"
import Cookies from "js-cookie"
import NavBarLg from "../components/sections/NavBarLg"

export default function DoctorProfile() {
  const { doctorId: paramsDoctorId } = useParams()
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const patientId = localStorage.getItem("patientId")
  const storedDoctorId = localStorage.getItem("doctorId")

  // Use doctorId from URL params first, fallback to localStorage
  const doctorId = paramsDoctorId || storedDoctorId
  const baseURL = "http://localhost:8080/api/doctors" // backend base URL
  const token = Cookies.get("token")
  const navigate = useNavigate()

  // logout: remove auth cookies/localStorage and go to login
  const handleLogout = () => {
    Cookies.remove("token")
    Cookies.remove("userEmail")
    Cookies.remove("userRole")

    localStorage.removeItem("token")
    localStorage.removeItem("role")
    localStorage.removeItem("username")
    localStorage.removeItem("patientId")
    localStorage.removeItem("doctorId")
    localStorage.setItem("loggedIn", "false")

    navigate("/login")
  }

  useEffect(() => {
    let mounted = true
    const controller = new AbortController()

    if (!doctorId) {
      setError("No doctor ID found")
      setLoading(false)
      return
    }
    ;(async () => {
      setLoading(true)
      setError(null)
      const token = Cookies.get("token")
      const endpoints = [
        `${baseURL}/${doctorId}/profile`, // current
        `http://localhost:8080/api/users/doctor/${doctorId}/profile`,
        `http://localhost:8080/api/users/doctors/${doctorId}`,
        `http://localhost:8080/api/users/${doctorId}`,
      ]

      for (const url of endpoints) {
        try {
          console.log("Trying endpoint:", url)
          const res = await fetch(url,  {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        credentials: "include",
      })

          console.log("Response:", url, res.status, res.statusText)

          const text = await res.text().catch(() => "")
          // try parse JSON if present
          let body
          try {
            body = text ? JSON.parse(text) : null
          } catch {
            body = text
          }
          console.log("Response body:", body)

          if (res.ok) {
            // old:
            // const fetched = (body && (body.doctor || body.data || body.result)) || body || {}
            // if (mounted) {
            //   setDoctor(typeof fetched === "object" ? fetched : { fullName: String(fetched) })
            //   setError(null)
            //   setLoading(false)
            // }

            // new: normalize so parent fields (email, phoneNumber, id) are preserved
            const parent = body && typeof body === "object" ? body : {}
            const nested = parent.doctor || parent.data || parent.result || parent || {}

            const normalized = {
              // prefer nested fields, but fallback to parent
              id: nested.id || nested._id || parent.id || parent._id,
              fullName: nested.fullName || nested.name || parent.userName || parent.fullName || "Unknown",
              specialties: nested.specialties || [],
              languages: nested.languages || [],
              yearsOfExperience: nested.yearsOfExperience ?? nested.experience ?? 0,
              bio: nested.bio || nested.about || "",
              education: nested.education || [],
              avatarUrl: parent.avatarUrl || nested.avatarUrl || null,
              email: parent.email || nested.email || null,
              phoneNumber: parent.phoneNumber || nested.phoneNumber || null,
              role: parent.role || nested.role || null,
              // include raw so you can inspect other fields later
              raw: parent,
              ...nested,
            }

            if (mounted) {
              setDoctor(normalized)
              setError(null)
              setLoading(false)
            }
            controller.abort()
            return
          } else {
            // server returned an error body — log and try next endpoint
            console.warn("Endpoint returned error, trying next if any:", url, body)
          }
        } catch (err) {
          if (err.name === "AbortError") return
          console.error("Fetch failed for", url, err)
        }
      }

      if (mounted) {
        setError("Failed to fetch doctor profile. Check backend route/token (see console).")  
        setLoading(false)
      }
    })()

    return () => {
      mounted = false
      controller.abort()
    }
  }, [doctorId, patientId, token])

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading your profile...</p>
      </div>
    )
  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <p className="text-red-600 font-medium">Error: {error}</p>
        </div>
      </div>
    )

  if (!doctor)
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">No doctor found.</p>
      </div>
    )

  // determine if viewing own doctor profile (storedDoctorId set at login/registration)
  const viewingOwn =
    Boolean(storedDoctorId) && Boolean(doctor?.id || doctor?._id) && storedDoctorId === (doctor.id || doctor._id)

  return (
    <>
    <NavBarLg/>
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 pt-5 pl-5">
      <DoctorHeader />

      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8 md:py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 h-32 md:h-40"></div>
          <div className="px-6 md:px-10 pb-8">
            <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 md:-mt-20">
              <div
                className="w-32 h-32 md:w-40 md:h-40 rounded-2xl flex items-center justify-center text-white text-4xl md:text-5xl font-bold shadow-xl border-4 border-white"
                style={{ backgroundColor: "#0f766e" }}
              >
                {(doctor.fullName || "??")
                  .split(" ")
                  .map((s) => s[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </div>

              <div className="flex-1 md:mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 pb-2">{doctor.fullName}</h1>
                <div className="flex flex-wrap items-center gap-3 text-gray-600">
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-teal-100 text-teal-800 font-medium text-sm">
                    {doctor.specialties?.[0]?.name  || doctor.specialties?.[0] || "General Practitioner"}
                  </span>
                  <span className="text-lg">•</span>
                  <span className="font-medium">{doctor.yearsOfExperience ?? "—"} years experience</span>
                  {doctor.avgRating || doctor.rating ? (
                    <>
                      <span className="text-lg">•</span>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="font-semibold">{doctor.avgRating ?? doctor.rating}</span>
                        <span className="text-gray-500">({doctor.reviewsCount ?? doctor.reviews ?? 0} reviews)</span>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>

              {viewingOwn && (
                <div className="flex gap-3 md:mb-4">
                  <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="px-6 py-2.5 rounded-lg border-2 border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/doctor/${doctor.id || doctor._id}/edit`)}
                    className="px-8 py-2.5 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Quick info cards */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Contact Information
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Email</div>
                  <div className="text-gray-900 break-all">{doctor.email || "Not provided"}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Phone</div>
                  <div className="text-gray-900">{doctor.phoneNumber || "Not provided"}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Location</div>
                  <div className="text-gray-900">{doctor.clinicLocation?.city || "Not specified"}</div>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                  />
                </svg>
                Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {doctor.languages && doctor.languages.length ? (
                  doctor.languages.map((lang, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium">
                      {lang}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">Not specified</span>
                )}
              </div>
            </div>

            {/* Specialties */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Specialties
              </h3>
              <div className="flex flex-wrap gap-2">
                {doctor.specialties && doctor.specialties.length > 0 ? (
                  doctor.specialties.map((s, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-800 text-sm font-medium border border-teal-200"
                    >
                      {s?.name || s}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">Not specified</span>
                )}
              </div>
            </div>
          </aside>

          {/* Right column: Detailed information */}
          <main className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                About Me
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {doctor.bio ||
                  "No biography available yet. Add information about your background, expertise, and approach to patient care."}
              </p>
            </div>

            {/* Education Section */}
            {doctor.education && doctor.education.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  Education & Qualifications
                </h2>
                <div className="space-y-4">
                  {doctor.education.map((ed, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium">
                          {typeof ed === "string" ? ed : ed?.degree || ed?.institution || JSON.stringify(ed)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Professional Stats */}
            <div className="bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl shadow-md p-8 text-white">
              <h2 className="text-2xl font-bold mb-6">Professional Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{doctor.yearsOfExperience ?? "—"}</div>
                  <div className="text-teal-100">Years of Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{doctor.reviewsCount ?? doctor.reviews ?? 0}</div>
                  <div className="text-teal-100">Patient Reviews</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{doctor.specialties?.length ?? 1}</div>
                  <div className="text-teal-100">Specializations</div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-8">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 shadow"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div></>
  )
}
