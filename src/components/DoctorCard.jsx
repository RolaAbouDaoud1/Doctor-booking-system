import { Clock, MapPin, Star } from "lucide-react";

export default function DoctorCard({ doctor, onViewProfile, onBookNow }) {
  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border-0">
      <div className="flex gap-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0"
          style={{ backgroundColor: "#006d77" }}
        >
          {doctor.initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-1">
                {doctor.fullName}
              </h3>
              <p className="text-sm text-gray-600 mb-1">
                {doctor.specialties[0].name} • {doctor.yearsOfExperience} years
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 mb-1">
                <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                <span className="font-semibold text-sm">
                  {doctor.avgRating}
                </span>
                <span className="text-xs text-gray-500">
                  ({doctor.reviewsCount})
                </span>
              </div>
              <p className="font-semibold text-lg" style={{ color: "#006d77" }}>
                {doctor.price}
              </p>
            </div>
          </div>

          {/* Distance and Availability */}
          <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{doctor.distance}Lebanon</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Next: {doctor.nextAvailable}</span>
            </div>
          </div>

          {/* Languages */}
          <div className="flex gap-2 mb-4">
            {doctor.languages.map((language) => (
              <span
                key={language}
                className="px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-700"
              >
                {language}
              </span>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => onViewProfile && onViewProfile(doctor)}
              className="flex-1 py-2 px-4 rounded-lg border border-gray-200 hover:bg-gray-50 bg-transparent text-gray-700 transition-colors"
            >
              View Profile
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (typeof onBookNow === "function") onBookNow(doctor);
              }}
              className="flex-1 py-2 px-4 rounded-lg text-white hover:opacity-90 transition-colors"
              style={{ backgroundColor: "#006d77" }}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
