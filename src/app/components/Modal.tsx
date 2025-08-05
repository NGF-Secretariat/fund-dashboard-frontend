"use client";

import { ReactNode } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
            <div
                className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative"
            >
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
                    onClick={onClose}
                >
                    ✕
                </button>
                {title && <h2 className="text-lg font-bold mb-4 text-green-800">{title}</h2>}
                {children}
            </div>
        </div>
    );
}
