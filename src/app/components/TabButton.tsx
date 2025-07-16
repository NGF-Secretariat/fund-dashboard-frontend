import React from "react";

interface TabButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}

export const TabButton: React.FC<TabButtonProps> = ({ icon, label, onClick, active = false }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-md transition border border-borderColor
        ${active ? 'bg-textRed text-gray-200 font-bold' : 'text-textRed hover:bg-gray-100'}`}
    >
      {icon}
      <span className={`text-sm font-medium ${active ? 'text-gray-200' : 'text-textRed'}`}>{label}</span>
    </button>
  );
};
