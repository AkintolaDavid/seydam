// src/components/DarkMode.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const DarkModeContext = createContext();

export const useDarkMode = () => useContext(DarkModeContext);

export const DarkModeProvider = ({ children }) => {
  // initialize from localStorage or default to light
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.theme === 'dark';
  });

  // whenever `dark` changes, toggle the class on <html> and persist
  useEffect(() => {
    const root = window.document.documentElement;
    if (dark) root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.theme = dark ? 'dark' : 'light';
  }, [dark]);

  // expose toggle function
  const toggle = () => setDark((prev) => !prev);

  return (
    <DarkModeContext.Provider value={{ dark, toggle }}>
      {children}
    </DarkModeContext.Provider>
  );
};