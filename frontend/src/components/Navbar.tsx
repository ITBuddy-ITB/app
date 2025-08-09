import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { Menu, X, Home, BarChart3, Building2, TrendingUp, LogOut, User, ChevronDown, Sparkles } from "lucide-react";

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  const navLinks = [
    { to: "/", label: "Beranda", icon: Home },
    { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { to: "/business", label: "Bisnis", icon: Building2 },
    { to: "/investments", label: "Investasi", icon: TrendingUp },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-xl border-b shadow-2xl"
      style={{
        background: "rgba(241, 237, 234, 0.7)",
        borderColor: "rgba(96, 42, 29, 0.2)",
        boxShadow: "0 8px 32px rgba(96, 42, 29, 0.1)",
      }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <motion.div
                className="h-10 w-10 bg-brown-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                initial={{ rotate: 0 }}
                animate={{
                  rotate: [0, 360, 360, 0, 0, 0, 0, 0, 0, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatDelay: 5,
                  ease: "easeInOut",
                }}
                whileHover={{
                  rotate: 360,
                  transition: { duration: 0.6, ease: "easeInOut" },
                }}>
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}>
                  <Sparkles className="h-5 w-5 text-white" />
                </motion.div>
              </motion.div>
              <div className="absolute -inset-1 bg-brown-primary rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-brown-primary">SINAR</h1>
              <p className="text-xs text-gray-500 -mt-1">Solusi Inklusif untuk Akselerasi Rintisan</p>
            </div>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group ${
                    isActive(link.to) ? "bg-brown-primary text-white shadow-lg" : "text-gray-700 hover:text-brown-primary hover:bg-gray-50"
                  }`}>
                  <Icon className={`h-4 w-4 ${isActive(link.to) ? "text-white" : "text-gray-500 group-hover:text-brown-primary"} transition-colors duration-300`} />
                  <span>{link.label}</span>
                  {isActive(link.to) && <div className="absolute inset-0 bg-white/20 rounded-xl"></div>}
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 border border-gray-200">
                  <div className="h-8 w-8 bg-brown-primary rounded-lg flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Akun</span>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {/* User Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">Selamat datang kembali!</p>
                      <p className="text-xs text-gray-500">Kelola akun Anda</p>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200">
                      <LogOut className="h-4 w-4" />
                      <span>Keluar</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-brown-primary transition-colors duration-200">
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="relative px-6 py-2 bg-brown-primary text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
                  <span className="relative z-10">Mulai Sekarang</span>
                  <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-xl text-gray-700 hover:text-brown-primary hover:bg-gray-50 focus:outline-none transition-all duration-300">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive(link.to) ? "bg-brown-primary text-white shadow-lg" : "text-gray-700 hover:text-brown-primary hover:bg-gray-50"
                  }`}>
                  <Icon className={`h-5 w-5 ${isActive(link.to) ? "text-white" : "text-gray-500"}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Auth Section */}
          <div className="px-4 py-4 border-t border-gray-200/50">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-xl">
                  <div className="h-8 w-8 bg-brown-primary rounded-lg flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Akun</p>
                    <p className="text-xs text-gray-500">Selamat datang kembali!</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors duration-200">
                  <LogOut className="h-4 w-4" />
                  <span>Keluar</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="w-full block text-center px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors duration-200">
                  Masuk
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="w-full block text-center px-4 py-3 bg-brown-primary text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  Mulai Sekarang
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
