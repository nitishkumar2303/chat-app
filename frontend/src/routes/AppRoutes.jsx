import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Registration from "../pages/Registration";
import Home from "../pages/Home";
import Project from "../pages/Project";
import UserAuth from "../auth/UserAuth";


const AppRoutes = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserAuth><Home/></UserAuth>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/project" element={<UserAuth><Project /></UserAuth>} />

        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default AppRoutes;
