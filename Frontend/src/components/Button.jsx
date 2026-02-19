import React from "react";

export const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
  fullWidth = false,
}) => {
  const baseStyles =
    "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary:
      "bg-[#1F3A5F] text-white hover:bg-[#2F5D8A] focus:ring-[#4A7BA7]",
    secondary:
      "bg-white text-[#1F3A5F] border border-gray-300 hover:bg-gray-50 focus:ring-[#4A7BA7]",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyle} ${className}`}
    >
      {children}
    </button>
  );
};
