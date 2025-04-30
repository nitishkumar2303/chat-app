import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { UserProvider } from "./context/user.context";
import Navbar from "./components/Navbar";

function App() {
  return (
    
    <UserProvider>
      {/* <Navbar/> */}
      <AppRoutes/>
    </UserProvider>
  );
}

export default App;
