"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export const FloatingInput = ({
  label,
  id,
  error,
  className,
  required,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  useEffect(() => {
    setHasValue(!!props.value);
  }, [props.value]);

  return (
    <div className="relative mb-4">
      <div className="relative">
        <input
          id={id}
          className={`peer w-full px-4 pt-4 pb-2 rounded-lg border ${
            error
              ? "border-red-300 focus:border-red-500"
              : "border-gray-300 focus:border-[#000000]]"
          } bg-white text-gray-900 outline-none transition-all duration-200 focus:shadow-sm ${className}`}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            setHasValue(!!e.target.value);
          }}
          {...props}
        />
        <label
          htmlFor={id}
          className={`absolute left-4 transition-all duration-200 pointer-events-none ${
            isFocused || hasValue
              ? "text-xs top-2 text-[#000000]]"
              : "text-base text-gray-500 top-1/2 -translate-y-1/2"
          }`}
        >
          {label}
          {required && <span className="text-[#000000]] ml-1">*</span>}
        </label>
      </div>
      {error && (
        <motion.p
          className="text-red-500 text-xs mt-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export const FloatingTextarea = ({
  label,
  id,
  error,
  className,
  required,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  useEffect(() => {
    setHasValue(!!props.value);
  }, [props.value]);

  return (
    <div className="relative mb-4">
      <div className="relative">
        <textarea
          id={id}
          className={`peer w-full px-4 pt-4 pb-2 rounded-lg border ${
            error
              ? "border-red-300 focus:border-red-500"
              : "border-gray-300 focus:border-[#000000]]"
          } bg-white text-gray-900 outline-none transition-all duration-200 focus:shadow-sm ${className}`}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            setHasValue(!!e.target.value);
          }}
          {...props}
        />
        <label
          htmlFor={id}
          className={`absolute left-4 transition-all duration-200 pointer-events-none ${
            isFocused || hasValue
              ? "text-xs top-2 text-[#000000]]"
              : "text-base text-gray-500 top-6"
          }`}
        >
          {label}
          {required && <span className="text-[#000000]] ml-1">*</span>}
        </label>
      </div>
      {error && (
        <motion.p
          className="text-red-500 text-xs mt-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export const FloatingSelect = ({
  label,
  id,
  error,
  options,
  className,
  required,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  useEffect(() => {
    setHasValue(!!props.value);
  }, [props.value]);

  return (
    <div className="relative mb-4">
      <div className="relative">
        <select
          id={id}
          className={`peer w-full px-4 pt-4 pb-2 rounded-lg border appearance-none ${
            error
              ? "border-red-300 focus:border-red-500"
              : "border-gray-300 focus:border-[#000000]]"
          } bg-white text-gray-900 outline-none transition-all duration-200 focus:shadow-sm ${className}`}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            setHasValue(!!e.target.value);
          }}
          {...props}
        >
          <option value=""></option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <label
          htmlFor={id}
          className={`absolute left-4 transition-all duration-200 pointer-events-none ${
            isFocused || hasValue
              ? "text-xs top-2 text-[#000000]]"
              : "text-base text-gray-500 top-1/2 -translate-y-1/2"
          }`}
        >
          {label}
          {required && <span className="text-[#000000]] ml-1">*</span>}
        </label>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      {error && (
        <motion.p
          className="text-red-500 text-xs mt-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};
