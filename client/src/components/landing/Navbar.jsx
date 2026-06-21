import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun, MonitorPlay, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shadow-sm py-4 border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <MonitorPlay className="h-8 w-8 text-blue-600 dark:text-blue-500" />
          <span className="font-bold text-2xl tracking-tight text-slate-900 dark:text-white">
            Prep<span className="text-blue-600 dark:text-blue-500">AI</span>
          </span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Features</a>
          <a href="#testimonials" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Testimonials</a>
          
          <div className="flex items-center gap-4 ml-4">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <Link to="/login">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition-colors shadow-lg shadow-blue-600/20">
                Login
              </button>
            </Link>
          </div>
        </nav>

        {/* Mobile Toggle & Dark Mode */}
        <div className="flex items-center gap-4 md:hidden">
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-700 dark:text-slate-300"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-lg p-4 flex flex-col gap-4">
          <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 dark:text-slate-300 hover:text-blue-600 font-medium py-2">Features</a>
          <a href="#testimonials" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 dark:text-slate-300 hover:text-blue-600 font-medium py-2">Testimonials</a>
          <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="mt-2">
            <button className="w-30 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-3xl font-medium transition-colors">
              Login
            </button>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
