import React from "react";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Layout;
