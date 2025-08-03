import React, { useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { Menu, X } from "lucide-react";

// TODO: animate burger menu
const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/businesses", label: "Business Evaluation" },
    { to: "/investments", label: "Investment" },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">ITBuddy</h1>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === link.to ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600"
                }`}>
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 border-2 hover:bg-blue-700 border-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700 hover:text-blue-600 focus:outline-none">
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-blue-100 px-4 py-3 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`block text-sm font-medium transition-colors duration-200 ${
                location.pathname === link.to ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600"
              }`}>
              {link.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
              Logout
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 text-center">
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="bg-blue-600 hover:bg-blue-700 border-2 border-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 text-center">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
