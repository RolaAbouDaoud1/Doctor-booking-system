import { stats } from "../../data/homePage"
export default function StatSection({darkMode}) {
  return (
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="flex justify-center">
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <div
                  className={`text-2xl lg:text-3xl font-bold ${
                    darkMode ? "text-white" : "text-gray"
                  }`}
                >
                  {stat.number}
                </div>
                <div
                  className={`text-sm ${
                    darkMode ? "text-white/70" : "text-gray/70"
                  }`}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
  )
}
