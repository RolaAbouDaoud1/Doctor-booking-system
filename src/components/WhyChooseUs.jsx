import { Activity, BadgeCheck, Calendar } from "lucide-react";
export default function WhyChooseUs() {
  const chooseUsData = [
    {
      icon: Calendar,
      header: "Easy Booking",
      description: "Schedule appointments in just a few taps",
    },
    {
      icon: BadgeCheck,
      header: "Verified Professionals",
      description: "Connect with trusted doctors and specialists",
    },
    {
      icon: Activity,
      header: "Secure Health Records",
      description: "Easily access and manage your medical history in one place",
    },
  ];

  const createChooseUsBody = (header, description) => {
    return (
      <>
        <div className="flex flex-col items-start justify-center text-sm max-w-7/10 ">
          <h1 className="font-bold">{header}</h1>
          <h2>{description}</h2>
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      {chooseUsData.map((card, index) => {
        return (
          <div
            key={index}
            className="bg-white rounded-2xl border-1 border-gray-300 flex flex-row items-center justify-around gap-2 w-10/12 mx-auto h-20"
          >
            <div className="bg-light-teal rounded-full">
              <card.icon size={40} className="  text-white p-2" />
            </div>
            {createChooseUsBody(card.header, card.description)}
          </div>
        );
      })}
    </div>
  );
}
