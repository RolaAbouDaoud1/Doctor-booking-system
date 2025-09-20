import { Activity, ChevronRight, House, User } from "lucide-react";import { ClipboardClock } from 'lucide-react';
export default function DropList({setShowDropList}) {
  const DropListData = [
    { icon: House, role: "Home" },
    { icon: ClipboardClock, role: "My Appointments" },
    { icon: Activity, role: "Search For A Doctor" },
    { icon: User, role: "My Profile" },
  ];

  return (
    <div className="absolute inset-0 z-20 pt-20 backdrop-blur-md ">
      {DropListData.map((item, index) => {
        return (
          <div
           className=" animate-down flex items-center justify-between p-4 font-medium border-b border-neutral-800/50 last:border-b-0"
             onClick={() => setShowDropList(false)}
                  key={index}
          >
            <div className="flex items-center gap-3">   
              <item.icon
                size={25}
                className={` text-teal transition-colors`}
              />
              <span className="text-base text-gray font-semibold transition-colors">
                {item.role}
              </span>
            </div>
            <ChevronRight
              size={16}
              className="text-neutral-500 transition-colors"
            />
          </div>
        );
      })}
    </div>
  );
}
