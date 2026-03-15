import { useState } from "react"; 
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/Context";
import { Layout, LogOut, Menu, X, ChevronRight } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // Mobile state

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 md:px-12 py-4 flex justify-between items-center sticky top-0 z-50">
      
      {/* Logo section */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="bg-blue-600 p-1.5 rounded-lg transition-transform group-hover:scale-105">
          <Layout className="text-white" size={20} />
        </div>
        <h1 className="font-bold text-xl tracking-tight text-gray-900">
          AI Resume <span className="text-blue-600">Analyzer</span>
        </h1>
      </Link>

      {/* Navigation */}
      <div className="flex gap-4 md:gap-8 items-center">

        {/* Main navigation links  */}
        <div className="hidden md:flex gap-6 text-sm font-bold">
          <Link
            to="/"
            className={`${isActive("/") ? "text-blue-600" : "text-gray-500 hover:text-gray-900"} transition-colors`}
          >
            Home
          </Link>
          <Link
            to="/analyze"
            className={`${isActive("/analyze") ? "text-blue-600" : "text-gray-500 hover:text-gray-900"} transition-colors`}
          >
            Analyze
          </Link>
          <Link
            to="/history"
            className={`${isActive("/history") ? "text-blue-600" : "text-gray-500 hover:text-gray-900"} transition-colors`}
          >
            History
          </Link>
        </div>

        {/* Vertical divider desktop only */}
        <div className="h-6 w-[1px] bg-gray-200 hidden md:block"></div>

        {/* Auth section */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-gray-600 hidden lg:inline">
                Hi, {user.name?.split(" ")[0] || "User"}
              </span>
              <button
                onClick={logout}
                className="hidden sm:flex items-center gap-2 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 px-4 py-2 rounded-lg text-sm font-bold transition-all border border-gray-200 hover:border-red-100"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden sm:block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-sm transition-all"
            >
              Login
            </Link>
          )}

          {/* MOBILE TOGGLE BUTTON for small screens) */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden p-2 rounded-lg bg-gray-50 text-gray-600"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl md:hidden animate-in slide-in-from-top-2">
          <div className="flex flex-col p-4 gap-2">
            <Link 
              to="/" 
              onClick={() => setIsOpen(false)}
              className={`p-3 rounded-lg font-bold ${isActive("/") ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
            >
              Home
            </Link>
            <Link 
              to="/analyze" 
              onClick={() => setIsOpen(false)}
              className={`p-3 rounded-lg font-bold ${isActive("/analyze") ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
            >
              Analyze
            </Link>
            <Link 
              to="/history" 
              onClick={() => setIsOpen(false)}
              className={`p-3 rounded-lg font-bold ${isActive("/history") ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
            >
              History
            </Link>
            <div className="mt-2 pt-2 border-t border-gray-100">
              {user ? (
                <button 
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="w-full text-left p-3 rounded-lg font-bold text-red-600 hover:bg-red-50 flex items-center justify-between"
                >
                  Logout <LogOut size={16} />
                </button>
              ) : (
                <Link 
                  to="/login" 
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center p-3 rounded-lg font-bold bg-blue-600 text-white block"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}