import CurrencyManager from "@/app/components/Currencymanager";
import React from "react";
import { Toaster } from "react-hot-toast";

export default function CurrencyPage() {
  return (
    <div>
      <Toaster position="top-right" />
      <h1 className="text-lg font-bold mb-4 text-black">Currency Management</h1>
      <CurrencyManager />
    </div>
  );
}
