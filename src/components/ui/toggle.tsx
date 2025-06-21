import React from "react";

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  label?: string;
  className?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  enabled,
  onChange,
  size = "md",
  disabled = false,
  label,
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-8 h-4",
    md: "w-11 h-6",
    lg: "w-14 h-7",
  };

  const thumbSizeClasses = {
    sm: "h-3 w-3",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const translateClasses = {
    sm: "translate-x-4",
    md: "translate-x-5",
    lg: "translate-x-7",
  };

  return (
    <div className={`flex items-center ${className}`}>
      {label && (
        <span className="mr-3 text-sm font-medium text-gray-700">{label}</span>
      )}
      <button
        type="button"
        className={`${sizeClasses[size]} ${
          enabled ? "bg-green-800" : "bg-gray-200 dark:bg-gray-500/50"
        } relative inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
        role="switch"
        aria-checked={enabled}
        onClick={() => !disabled && onChange(!enabled)}
        disabled={disabled}
      >
        <span
          className={`${enabled ? translateClasses[size] : "translate-x-0"} ${
            thumbSizeClasses[size]
          } transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
        />
      </button>
    </div>
  );
};

export default Toggle; 