import { Search } from "lucide-react";
export default function SearchBar() {
  return (
    <div className=" flex flex-row items-center justify-around rounded-lg border-1 border-gray-400 p-2 w-8/10 text-md">
      <Search size={18}  className="text-light-teal"/>
      <input type="text" placeholder="Search for doctors, specialities...." className="outline-0 min-w-55 "/>
    </div>
  );
}
