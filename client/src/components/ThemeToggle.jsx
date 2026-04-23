import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-16 h-8 flex items-center bg-gray-200 dark:bg-gray-700 rounded-full p-1 transition-colors duration-500 focus:outline-none"
    >
      {/* Moving Handle */}
      <motion.div
        animate={{ x: isDarkMode ? 32 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="w-6 h-6 bg-white dark:bg-pink-600 rounded-full shadow-md flex items-center justify-center z-10"
      >
        {isDarkMode ? (
          <Moon size={14} className="text-white" />
        ) : (
          <Sun size={14} className="text-pink-600" />
        )}
      </motion.div>

      {/* Static Icons in Background */}
      <div className="absolute inset-0 flex justify-between items-center px-2">
        <Sun size={14} className="text-pink-400 opacity-50" />
        <Moon size={14} className="text-gray-400 opacity-50" />
      </div>
    </button>
  );
};

export default ThemeToggle;