import Cookies from "js-cookie";
import {
  AlertCircle,
  ChevronLeft,
  Edit2,
  FileText,
  Mail
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
        // normalize: backend may return parent with .patient nested or patient directly
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
        // in case failed!
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
    if (!patient?.id) return;
    navigate(`/patient/${patient.id}/edit`);
  };

  if (loading)
    return (
      <div className="pp-loading">
        <div className="pp-spinner" />
        <p>Loading patient profile…</p>
      </div>
    );

  return (
    <>
    <NavBarLg/>
    <div className="patient-page min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-4 md:p-8">
      <PatientHeader />
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 h-28" />
          <div className="px-6 md:px-10 pb-8">
            <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 md:-mt-18">
              <div
                className="w-28 h-28 md:w-36 md:h-36 rounded-2xl flex items-center justify-center text-white text-3xl md:text-4xl font-bold shadow-xl border-4 border-white"
                style={{ backgroundColor: "#0f766e" }}
              >
                {patient.initials}
              </div>

              <div className="flex-1 md:mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 pb-3">{patient.fullName}</h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="text-sm">
                    <span className="font-medium">DOB:</span>{" "}
                    <span>{patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : "Not set"}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Insurance:</span>{" "}
                    <span>{patient.insuranceNumber || "—"}</span>
                  </div>
                </div>
              </div>

              <div className="ml-auto flex gap-3 md:mb-4 ">
                <button
                  onClick={() => navigate(-1)}
                  className="px-5 py-2.5 rounded-lg border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                >
                  <ChevronLeft className="inline mr-2" size={16} />
                  Back
                </button>
                <button
                  onClick={handleEdit}
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 text-white"
                >
                  <Edit2 className="inline mr-2" size={16} />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-teal-600" />
                Contact
              </h3>
              <div className="space-y-3 text-gray-700">
                <div>
                  <div className="text-xs text-gray-500">Email</div>
                  <div className="break-all">{patient.email || "Not provided"}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Phone</div>
                  <div>{patient.phoneNumber || "Not provided"}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Insurance #</div>
                  <div>{patient.insuranceNumber || "Not provided"}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-teal-600" />
                Allergies
              </h3>
              <div>
                {patient.allergies && patient.allergies.length ? (
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies.map((a, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-yellow-50 text-yellow-800 text-sm">
                        {a}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500">None reported</div>
                )}
              </div>
            </div>
          </aside>

          <main className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-teal-600" />
                Medical History
              </h2>

              {patient.medicalHistory && patient.medicalHistory.length ? (
                <div className="space-y-4">
                  {patient.medicalHistory.map((h, idx) => (
                    <div key={idx} className="p-4 rounded-lg border border-gray-100">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm text-gray-600">{h.type || "Event"}</div>
                          <div className="text-base font-medium text-gray-900">{h.title || h.note || "Details"}</div>
                        </div>
                        <div className="text-sm text-gray-500">{h.date ? new Date(h.date).toLocaleDateString() : ""}</div>
                      </div>
                      {h.notes && <p className="mt-2 text-gray-700">{h.notes}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-600">No medical history recorded.</div>
              )}
            </div>

            <div className="bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl shadow-md p-8 text-white">
              <h3 className="text-xl font-bold mb-4">Overview</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">{patient.medicalHistory?.length ?? 0}</div>
                  <div className="text-teal-100">Records</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{patient.allergies?.length ?? 0}</div>
                  <div className="text-teal-100">Allergies</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{patient.dateOfBirth ? new Date(patient.dateOfBirth).getFullYear() : "—"}</div>
                  <div className="text-teal-100">Birth Year</div>
                </div>
              </div>
            </div>
          </main>
        </div>
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
    </div></>
  );
}
