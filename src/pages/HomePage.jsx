import React from "react";
import img from "../assets/LandingImage.webp";
import DropList from "../components/DropList";
import FindDoctors from "../components/FindDoctors";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import WhyChooseUs from "../components/WhyChooseUs";
export default function HomePage({ darkMode, setDarkMode }) {
  // Please note that the Documentation is done with no help of AI tools
  // For any issues contact me directly
  const [showDropList, setShowDropList] = React.useState(false);
  const joinButtons = [
    {
      role: "Patient",
      styling: "bg-[#E29578] border-2 border-[#E29578] text-white",
    },
    {
      role: "Doctor",
      styling: "bg-transperant border-1 border-[#006d77] text-teal",
    },
  ];
  /*Function that creates and return II buttons based on given args #2iTEMS*/
  const createButton = (role, styling, index) => {
    return (
      <div
        className={`  rounded-lg p-2 w-1/3 text-center text-xs ${styling} font-bold rounded-xl`}
        key={index}
      >
        Join as {role}
      </div>
    );
  };

  return (
    <>
      <Navbar
        setShowDropList={setShowDropList}
        showDropList={showDropList}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      <div className={`min-h-screen ${darkMode ? "bg-teal" : "bg-color"} caret-transparent`}>
        <div className=" flex flex-col justify-center items-center pt-20 space-y-2">
          <img
            src={img}
            alt="Doctor Image"
            className="rounded-full h-30 w-30 object-cover"
          />
          <h1 className="text-gray font-bold text-3xl">Your Health,</h1>
          <h2 className="text-teal font-bold text-3xl">Our Priority</h2>
          <p className="text-gray text-center mx-4 font-medium">
            Connect with qualified doctors and
            <br />
            <span> manage your healthcare journey with ease</span>
          </p>
          {/* Main widget*/}
          <div className="flex flex-col items-center justify-center mt-5   gap-3 border-1 border-gray-300 py-4 rounded-2xl w-10/12 mx-auto bg-white  ">
            <SearchBar />
            <FindDoctors />
          </div>
          {/*Join "AS" Section*/}
          <div className="flex flex-row items-center justify-around mt-2 w-full">
            {joinButtons.map((individual, index) => {
              return createButton(individual.role, individual.styling, index);
            })}
          </div>
          {/*Why Choose Us Section*/}
          <h1 className="mt-7 font-semibold text-xl">
            Why choose HealthConnect?
          </h1>
          <WhyChooseUs />
        </div>
      
          {showDropList && (
            <DropList setShowDropList={setShowDropList} darkMode={darkMode} />
          )}
     
      </div>
    </>
  );
}
