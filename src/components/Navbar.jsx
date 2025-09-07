import { Menu } from "lucide-react";

export default function Navbar() {
  return (
    <div className="p-2">
      <div className="  flex flex-row justify-between items-center mx-4">
        <h1 className="text-teal font-bold text-2xl"> HealthConnect </h1>
        <Menu className=" text-teal " size={30} />
      </div>
    </div>
  );
}
