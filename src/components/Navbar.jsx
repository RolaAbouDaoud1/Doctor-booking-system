import { Menu, Moon, Sun } from "lucide-react";
import { NotificationSystem } from "./NotificationSystem";
import DropList from "./DropList";
export default function Navbar({
  setShowDropList,
  showDropList,
  setDarkMode,
  darkMode,
}) {
  return (
    <>
    <div className="w-full fixed z-100 pt-2">
      <div className="  flex flex-row justify-between items-center mx-4">
        <h1
          className={`${
            darkMode ? "text-white" : "text-teal"
          } font-bold text-2xl`}
        >
          HealthConnect
        </h1>
        <div
          className={`flex flex-row items-center justify-between w-5/20  ${
            darkMode ? "text-white" : "text-teal"
          }`}
        >
          <NotificationSystem />
          {darkMode ? (
            <Moon size={2} onClick={() => setDarkMode(!darkMode)} />
          ) : (
            <Sun onClick={() => setDarkMode(!darkMode)} />
          )}
          <div className="lg:hidden">
            <Menu
              className=""
              size={30}
              onClick={() => setShowDropList(!showDropList)}
            />
          </div>
        </div>
      </div>
    </div>
      {showDropList && (
            <DropList setShowDropList={setShowDropList} darkMode={darkMode} />
          )}
     
    </>
  );
}
