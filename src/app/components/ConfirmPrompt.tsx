import React, { useEffect, useRef } from "react";

interface ConfirmPromptProps {
  message?: string;
  onConfirm: () => void;
  onClose: () => void;
  loading?: boolean;
}

const ConfirmPrompt: React.FC<ConfirmPromptProps> = ({
  message = "Are you sure?",
  onConfirm,
  onClose,
  loading = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node) && !loading) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, loading]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm text-center space-y-4"
      >
        <p className="text-gray-800 font-medium">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-red-300 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Processing...
              </>
            ) : (
              "Yes"
            )}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPrompt;
