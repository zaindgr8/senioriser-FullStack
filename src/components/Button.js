// components/Button.js
import React from "react";

const Button = ({ children, isActive, onClick }) => {
  return (
    <button
      className={`hover:text-blue-600 hover:border-b-2 hover:border-blue-600 ${
        isActive ? "text-blue-600 border-b-2 border-blue-600" : ""
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
