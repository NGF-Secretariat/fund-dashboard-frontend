// /app/dashboard/bank/page.tsx

import BankTableManager from "@/app/components/BankManager";
import React from "react";

export default function BankPage() {
  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4 text-black">Bank Management</h1>
      <BankTableManager />
    </div>
  );
}
