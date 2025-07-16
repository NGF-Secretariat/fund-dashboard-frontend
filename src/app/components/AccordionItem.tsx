import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface AccordionItemProps {
  title: string;
  content: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  content,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="border border-gray-200 rounded-md mb-3 overflow-hidden shadow-sm">
      <button
        onClick={onToggle}
        className={`w-full flex justify-between items-center px-5 py-4 bg-white hover:bg-green-50 transition`}
      >
        <span className="text-gray-800 font-medium text-base">{title}</span>
        {isOpen ? (
          <FaChevronUp className="text-gray-600 text-sm" />
        ) : (
          <FaChevronDown className="text-gray-600 text-sm" />
        )}
      </button>

      {isOpen && (
        <div className="px-5 py-4 bg-gray-50 text-sm text-gray-700 transition-all">
          {content}
        </div>
      )}
    </div>
  );
};
