// import { useState } from "react";
// import "./DoctorProfileF.css";

// export default function DoctorProfileF() {
//   const [profile, setProfile] = useState({
//     fullName: "Dr. Layla Khoury",
//     specialty: "Cardiology",
//     fee: 150,
//     availability: `Monday - Friday: 9:00 AM - 5:00 PM
//     Saturday: 9:00 AM - 1:00 PM
//     Sunday: Closed`,
//   });

//   const handleSave = () => {
//     // alert("Profile saved!");
//     // lezem tkon l data edited bl backend using update api
//   };

//   return (
//     <div className="profile-container">
//       <div className="profile-card">
//         {/* simple arrow icon */}
//         <button className="back-button">←</button>

//         <h2 className="page-title">Doctor Profile Management</h2>
//       </div>

//       <div className="info-cardd">
//         <div className="icon">
//           <i className="fa-regular fa-user"></i>{" "}
//         </div>
//       </div>

//       <div className="info-card">
//         <h3 className="Profile-info">Profile Information </h3>
//         <br />
//         <label>Full Name</label>
//         <input className="text" type="text" value={""} />
//         <br />
//         <br />
//         <label>Specialty</label>
//         <input className="text" type="text" value={""} />
//         <br />
//         <br />
//         <label>Consultation Fee ($)</label>
//         <input className="text" type="text" value={""} readOnly />
//         <br />
//         <br />
//         <label>Availability</label>
//         <textarea className="textareaaa" readOnly>
//           {""}
//         </textarea>
//       </div>

//       <button className="save-btn" onClick={handleSave}>
//         💾 Save Profile
//       </button>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function DoctorProfileF() {
  const [profile, setProfile] = useState({
    fullName: "",
    specialty: "",
    fee: "",
    availability: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const token = Cookies.get("token");
  const doctorId = localStorage.getItem("doctorId"); // logged-in doctor ID

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      if (!doctorId) {
        setError("Doctor ID not found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/users/doctor/${doctorId}/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to load doctor profile");

        const data = await response.json();
        setProfile({
          fullName: data.fullName || "",
          specialty: data.specialty || "",
          fee: data.fee || "",
          availability: data.availability || "",
        });
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [doctorId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSave = async () => {
    if (!doctorId) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/users/doctor/${doctorId}/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profile),
        }
      );

      if (response.ok) {
        alert("Profile updated successfully!");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while saving.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <button onClick={() => navigate(-1)}>← Back</button>
      <h2>Doctor Profile Management</h2>

      <div>
        <label>Full Name</label>
        <input
          name="fullName"
          type="text"
          value={profile.fullName}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Specialty</label>
        <input
          name="specialty"
          type="text"
          value={profile.specialty}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Consultation Fee ($)</label>
        <input
          name="fee"
          type="number"
          value={profile.fee}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Availability</label>
        <textarea
          name="availability"
          value={profile.availability}
          onChange={handleChange}
        ></textarea>
      </div>

      <button onClick={handleSave}>💾 Save Profile</button>
    </div>
  );
}
