import React from "react";

export const Badge = ({ children, variant, size = "md" }) => {
  const variantStyles = {
    pending: "bg-amber-100 text-amber-800 border-amber-300",
    "in-progress": "bg-blue-100 text-blue-800 border-blue-300",
    resolved: "bg-green-100 text-green-800 border-green-300",
    low: "bg-gray-100 text-gray-700 border-gray-300",
    medium: "bg-amber-100 text-amber-800 border-amber-300",
    high: "bg-orange-100 text-orange-800 border-orange-300",
    critical: "bg-red-100 text-red-800 border-red-300",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded border ${
        variantStyles[variant]
      } ${sizeStyles[size]}`}
    >
      {children}
    </span>
  );
};
