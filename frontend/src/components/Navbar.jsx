import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null); // State to handle errors

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-950">
      <h1 className="text-white text-xl font-bold">ChatApp</h1>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        onClick={async () => {
          try {
            const token = localStorage.getItem("token"); // Retrieve the token from localStorage
            if (!token) throw new Error("No token found"); // Handle missing token

            const response = await axios.get("/users/logout", {
              headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
              },
            });
            console.log("Logout successful:", response.data);
            localStorage.removeItem("token"); // Clear the token from localStorage
            localStorage.removeItem("user"); // Clear the user data from localStorage

            navigate("/login"); // Redirect to the login page
          } catch (error) {
            console.error("Error during logout:", error);
            setError("Failed to logout. Please try again."); // Set error message
          }
        }}
      >
        Logout
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}{" "}
      {/* Display error message */}
    </nav>
  );
};

export default Navbar;
