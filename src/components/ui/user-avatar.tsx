import React from "react";

export const UserAvatar: React.FC<{ initials: string; bgColor?: string }> = ({
  initials,
  bgColor = "bg-gray-100",
}) => (
  <div
    className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium text-gray-600 ${bgColor}`}
  >
    {initials}
  </div>
); 