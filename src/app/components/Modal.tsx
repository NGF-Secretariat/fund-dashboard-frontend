"use client";

import { ReactNode, useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) => {
  if (!isOpen) return null;

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose(); // close the modal
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div
        className={`bg-white rounded-lg shadow-lg w-full p-6 relative ${sizeClasses[size]}`}
        ref={modalRef}
      >
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl font-bold cursor-pointer"
          onClick={onClose}
        >
          &times;
        </button>
        {title && (
          <h2 className="text-lg font-bold mb-4 text-green-800">{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
