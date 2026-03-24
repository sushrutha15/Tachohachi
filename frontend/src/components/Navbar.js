import React, { useState } from "react";
import { Link } from "react-router";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#f7f7f7] fixed top-0 left-0 w-full z-30 text-amber-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <img 
                src="https://res.cloudinary.com/do3cybcyl/image/upload/v1773360098/qt_q_95_ltggcn.webp"
                alt="Miyato Hibachi Dallas"
                style={{height: '120px', width: '120px', objectFit: 'cover', borderRadius: '8px'}}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <div className="flex items-center space-x-8 text-black font-medium">
              
              <Link 
                to="/" 
                className="hover:text-[#FF7E21] transition-colors duration-200 py-2 border-b-2 border-transparent hover:border-slate-900"
              >
                HOME
              </Link>

              <Link 
                to="/about" 
                className="hover:text-[#FF7E21] transition-colors duration-200 py-2 border-b-2 border-transparent hover:border-slate-900"
              >
                ABOUT
              </Link>

              <Link 
                to="/contact" 
                className="hover:text-[#FF7E21] transition-colors duration-200 py-2 border-b-2 border-transparent hover:border-slate-900"
              >
                CONTACT
              </Link>
            </div>

            {/* Book Now Button */}
            <div className="flex items-center ml-8">
              <Link 
                to="/book-catering" 
                className="bg-[#FF7E21] hover:bg-[#FF7E21] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                BOOK NOW
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-slate-700 hover:text-slate-900 focus:outline-none transition-colors duration-200 p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-slate-200">
            <nav className="flex flex-col space-y-4 pt-4">
              
              <Link
                to="/"
                className="text-slate-700 hover:text-slate-900 transition-colors duration-200 py-2 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                HOME
              </Link>

              <Link
                to="/menu"
                className="text-slate-700 hover:text-slate-900 transition-colors duration-200 py-2 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                MENU
              </Link>

              <Link
                to="/about"
                className="text-slate-700 hover:text-slate-900 transition-colors duration-200 py-2 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                ABOUT
              </Link>

              <Link
                to="/contact"
                className="text-slate-700 hover:text-slate-900 transition-colors duration-200 py-2 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                CONTACT
              </Link>

              {/* Mobile Book Now Button */}
              <div className="pt-4 border-t border-slate-200">
                <Link
                  to="/book-catering"
                  className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 text-center block"
                  onClick={() => setMenuOpen(false)}
                >
                  BOOK NOW
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;