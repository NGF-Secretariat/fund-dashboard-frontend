import BankTableManager from "@/app/components/BankManager";
import React from "react";
import { Toaster } from "react-hot-toast";

export default function BankPage() {
  return (
    <div>
      <Toaster position="top-right" />
      <h3 className="text-lg font-bold mb-4 text-black">Bank Management</h3>
      <BankTableManager />
    </div>
  );
}
