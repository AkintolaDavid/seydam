import { Avatar, Text, Button } from "@chakra-ui/react";
import { Menu, LogOut } from "lucide-react";
import logo from "../assets/logo/logowhitebg.png";
export default function Header({ onMenuClick, onLogout }) {
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");
  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("token"); // Remove token or session data
    if (onLogout) {
      onLogout(); // Call parent function if provided
    } else {
      window.location.reload(); // Refresh or navigate to login page
    }
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="h-16 px-6 sm:px-10 flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="p-0 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            <Menu className="w-6 h-6 text-green-600" />
          </button>
          <img className="block lg:hidden h-10" src={logo} />

          <Text fontSize="lg" fontWeight="medium" className="hidden lg:block">
            Welcome, {username}
          </Text>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* <div className="text-right">
            <Text fontWeight="medium">{username}</Text>
            <Text fontSize="sm" color="gray.600">
              {email}
            </Text>
          </div>
          <Avatar size="sm" name={username} /> */}
          <Button
            onClick={handleLogout}
            colorScheme="red"
            size="sm"
            className="flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4 mr-1" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
