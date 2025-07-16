// /app/dashboard/bank/page.tsx

import CurrencyManager from "@/app/components/Currencymanager";
import React from "react";

export default function CurrencyPage() {
  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4 text-black">Currency Management</h1>
      <CurrencyManager />
    </div>
  );
}
