import Cookies from "js-cookie";
import {
  AlertCircle,
  ChevronLeft,
  Edit2,
  FileText,
  Mail,
  Calendar,
  CreditCard,
  Activity,
  Search,
  Phone,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PatientHeader from "../components/PatientHeader";
import NavBarLg from "../components/sections/NavBarLg";
import "./PatientProfile.css";

export default function PatientProfile() {
  const { patientId: paramsPatientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [contactForm, setContactForm] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

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
    const controller = new AbortController();
    const pid = paramsPatientId || localStorage.getItem("patientId");

    if (!pid) {
      setError("No patient id found");
      setPatient({
        initials: "AM",
        fullName: "Ahmad Mansour",
        email: "ahmad.mansour@email.com",
        phoneNumber: "+961 (11) 123-4567",
        allergies: ["Penicillin", "Latex"],
        medicalHistory: [],
      });
      setLoading(false);
      return () => {};
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const token = Cookies.get("token");
        const res = await fetch(
          `http://localhost:8080/api/users/patient/${pid}/profile`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            credentials: "include",
            signal: controller.signal,
          }
        );

        const text = await res.text().catch(() => "");
        let data;
        try {
          data = text ? JSON.parse(text) : null;
        } catch {
          data = text;
        }

        if (!res.ok) {
          throw new Error(data?.message || text || `Failed (${res.status})`);
        }
        console.log(data)
        const parent = data || {};
        const nested = parent.patient || parent.data || parent.result || parent || {};

        const fullName = nested.fullName || nested.name || parent.fullName || parent.userName || "Unknown";
        const initials = fullName
          .split(" ")
          .map((s) => s[0] || "")
          .slice(0, 2)
          .join("")
          .toUpperCase() || "NA";

        const normalized = {
          id: parent.id || nested.id || nested._id || parent._id,
          initials,
          fullName,
          email: parent.email || nested.email || "Not provided",
          phoneNumber: parent.phoneNumber || nested.phoneNumber || nested.phone || "Not provided",
          dateOfBirth: nested.dateOfBirth || parent.dateOfBirth || null,
          insuranceNumber: nested.insuranceNumber || parent.insuranceNumber || null,
          allergies: nested.allergies || parent.patient?.allergies || [],
          medicalHistory: nested.medicalHistory || parent.medicalHistory || nested.history || parent.history || [],
          raw: parent,
          ...nested,
        };

        setPatient(normalized);
      } catch (err) {
        console.error("Fetch patient error:", err);
        setError(String(err.message || err));
        setPatient({
          initials: "AM",
          fullName: "Ahmad Mansour",
          email: "ahmad.mansour@email.com",
          phoneNumber: "+961 (11) 123-4567",
          allergies: ["Penicillin", "Latex"],
          medicalHistory: [],
        });
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [paramsPatientId]);

  const handleEdit = () => {
    setContactForm({
      email: patient.email,
      phoneNumber: patient.phoneNumber,
      insuranceNumber: patient.insuranceNumber
    });
    setIsEditingContact(true);
  };

  const handleSaveContact = () => {
    setPatient({
      ...patient,
      email: contactForm.email || patient.email,
      phoneNumber: contactForm.phoneNumber || patient.phoneNumber,
      insuranceNumber: contactForm.insuranceNumber || patient.insuranceNumber
    });
    setIsEditingContact(false);
  };

  const handleSearchMedicine = (medicine) => {
    const query = encodeURIComponent(medicine);
    window.open(`https://www.google.com/search?q=${query}+medication`, '_blank');
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const getRecordsByDate = (date) => {
    if (!date) return [];
    const targetDate = new Date(date).toLocaleDateString();
    return patient.medicalHistory.filter(h => 
      h.date && new Date(h.date).toLocaleDateString() === targetDate
    );
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-teal-200 rounded-full animate-ping"></div>
            <div className="absolute inset-0 border-4 border-t-teal-600 border-r-teal-600 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-lg text-teal-700 font-medium animate-pulse">Loading patient profile…</p>
        </div>
      </div>
    );

  return (
    <>
      <NavBarLg/>
      <div className="patient-page min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-4 md:p-8">
        <PatientHeader />
        <div className="max-w-7xl mx-auto">
          {/* Hero Card */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 transform transition-all duration-500 hover:shadow-2xl">
            <div className="relative bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 h-32 overflow-hidden">
              <div className="absolute inset-0 opacity-30">
                <div className="absolute w-full h-full" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)',
                  backgroundSize: '40px 40px',
                  animation: 'drift 20s linear infinite'
                }}></div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            </div>
            
            <div className="px-6 md:px-10 pb-8 pt-4">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 -mt-12">
                <div className="flex flex-col md:flex-row md:items-end gap-6 flex-1">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-2xl opacity-75 group-hover:opacity-100 blur-lg transition-all duration-500 animate-pulse"></div>
                      <div
                        className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl flex items-center justify-center text-white text-4xl md:text-5xl font-bold shadow-2xl border-4 border-white transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                        style={{ background: "linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)" }}
                      >
                        {patient?.initials || "NA"}
                      </div>
                    </div>
                  </div>

                  {/* Patient Info */}
                  <div className="flex-1 md:mb-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 break-words">
                      {patient?.fullName || "Loading..."}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => patient.dateOfBirth && handleDateClick(patient.dateOfBirth)}
                        className="group flex items-center gap-2 text-sm bg-gradient-to-r from-teal-50 to-cyan-50 px-4 py-2 rounded-xl border border-teal-200 transition-all duration-300 hover:from-teal-100 hover:to-cyan-100 hover:shadow-lg hover:scale-105 cursor-pointer"
                      >
                        <Calendar className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
                        <span className="font-medium text-gray-700">DOB:</span>
                        <span className="text-gray-900">{patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : "Not set"}</span>
                      </button>
                      <div className="flex items-center gap-2 text-sm bg-gradient-to-r from-cyan-50 to-blue-50 px-4 py-2 rounded-xl border border-cyan-200 transition-all duration-300 hover:from-cyan-100 hover:to-blue-100 hover:shadow-lg">
                        <CreditCard className="w-4 h-4 text-cyan-600" />
                        <span className="font-medium text-gray-700">Insurance:</span>
                        <span className="text-gray-900">{patient.insuranceNumber || "—"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 md:mb-4">
                  <button
                    onClick={() => navigate(-1)}
                    className="px-5 py-2.5 rounded-xl border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-teal-400 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <ChevronLeft className="inline mr-2" size={18} />
                    Back
                  </button>
                  <button
                    onClick={handleEdit}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    <Edit2 className="inline mr-2" size={18} />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-6">
              {/* Contact Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-teal-100">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Contact</h3>
                  </div>
                </div>
                
                {!isEditingContact ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl transition-all duration-300 hover:shadow-md border border-teal-100">
                      <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 mb-2">
                        <Mail className="w-3 h-3" />
                        EMAIL
                      </div>
                      <div className="text-sm text-gray-900 break-all font-medium">{patient.email || "Not provided"}</div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl transition-all duration-300 hover:shadow-md border border-cyan-100">
                      <div className="flex items-center gap-2 text-xs font-semibold text-cyan-700 mb-2">
                        <Phone className="w-3 h-3" />
                        PHONE
                      </div>
                      <div className="text-sm text-gray-900 font-medium">{patient.phoneNumber || "Not provided"}</div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl transition-all duration-300 hover:shadow-md border border-blue-100">
                      <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-2">
                        <CreditCard className="w-3 h-3" />
                        INSURANCE
                      </div>
                      <div className="text-sm text-gray-900 font-medium">{patient.insuranceNumber || "Not provided"}</div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={contactForm.email || ""}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={contactForm.phoneNumber || ""}
                        onChange={(e) => setContactForm({...contactForm, phoneNumber: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">Insurance</label>
                      <input
                        type="text"
                        value={contactForm.insuranceNumber || ""}
                        onChange={(e) => setContactForm({...contactForm, insuranceNumber: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={handleSaveContact}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-300"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditingContact(false)}
                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Allergies Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-amber-100">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-lg">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Allergies</h3>
                </div>
                <div>
                  {patient.allergies && patient.allergies.length ? (
                    <div className="flex flex-wrap gap-2">
                      {patient.allergies.map((a, i) => (
                        <button
                          key={i}
                          onClick={() => handleSearchMedicine(a)}
                          className="group px-4 py-2 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 text-amber-900 text-sm font-semibold border-2 border-amber-200 hover:from-amber-100 hover:to-orange-100 hover:border-amber-400 transform transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer flex items-center gap-2"
                        >
                          <span>{a}</span>
                          <Search className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-center p-4 bg-gray-50 rounded-lg">None reported</div>
                  )}
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="lg:col-span-2 space-y-6">
              {/* Medical History */}
              <div className="bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-2xl border border-teal-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-600 flex items-center justify-center shadow-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Medical History</h2>
                </div>

                {patient.medicalHistory && patient.medicalHistory.length ? (
                  <div className="space-y-4">
                    {patient.medicalHistory.map((h, idx) => (
                      <div 
                        key={idx} 
                        className="group p-5 rounded-xl border-2 border-gray-100 hover:border-teal-300 bg-gradient-to-r from-white via-teal-50/20 to-cyan-50/20 transition-all duration-300 hover:shadow-xl hover:-translate-x-2"
                        style={{ animation: `slideIn 0.5s ease-out ${idx * 100}ms both` }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 text-xs font-bold mb-2 border border-teal-200">
                              {h.type || "Event"}
                            </div>
                            <div className="text-base font-semibold text-gray-900 group-hover:text-teal-700 transition-colors">
                              {h.title || h.note || "Details"}
                            </div>
                          </div>
                          {h.date && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                              <Calendar className="w-4 h-4" />
                              {new Date(h.date).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        {h.notes && (
                          <p className="mt-3 text-gray-700 leading-relaxed pl-4 border-l-4 border-teal-300 bg-teal-50/30 py-2 rounded-r">
                            {h.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-teal-50 rounded-xl border-2 border-dashed border-gray-200">
                    <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No medical history recorded.</p>
                  </div>
                )}
              </div>

              {/* Overview Stats */}
              <div className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 rounded-2xl shadow-xl p-8 text-white transform transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -ml-48 -mb-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
                
                <h3 className="text-2xl font-bold mb-6 relative z-10">Patient Overview</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
                  <div className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-110 hover:rotate-1">
                    <div className="text-4xl font-bold mb-2">{patient.medicalHistory?.length ?? 0}</div>
                    <div className="text-teal-100 font-medium">Medical Records</div>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-110">
                    <div className="text-4xl font-bold mb-2">{patient.allergies?.length ?? 0}</div>
                    <div className="text-teal-100 font-medium">Known Allergies</div>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-110 hover:-rotate-1">
                    <div className="text-4xl font-bold mb-2">
                      {patient.dateOfBirth ? new Date(patient.dateOfBirth).getFullYear() : "—"}
                    </div>
                    <div className="text-teal-100 font-medium">Birth Year</div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* Date Modal */}
        {selectedDate && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-auto transform transition-all duration-300 scale-100">
              <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-cyan-600 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-white" />
                  <h3 className="text-xl font-bold text-white">
                    Records from {new Date(selectedDate).toLocaleDateString()}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-300"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="p-6">
                {getRecordsByDate(selectedDate).length > 0 ? (
                  <div className="space-y-4">
                    {getRecordsByDate(selectedDate).map((h, idx) => (
                      <div key={idx} className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-200">
                        <div className="font-semibold text-gray-900 mb-1">{h.title || h.note || "Details"}</div>
                        <div className="text-sm text-teal-700 mb-2">{h.type || "Event"}</div>
                        {h.notes && <p className="text-sm text-gray-700 mt-2">{h.notes}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No medical records found for this date.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <div className="max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-8">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleLogout}
              className="group px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:scale-105 flex items-center gap-2"
              style={{ background: "linear-gradient(135deg, #FF6B6B 0%, #EE5A6F 100%)" }}
            >
              <span>Logout</span>
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes drift {
          from {
            background-position: 0 0;
          }
          to {
            background-position: 40px 40px;
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}