// /app/dashboard/bank/page.tsx

import TransactionManager from "@/app/components/TransactionManager";
import React from "react";

export default function TransactionPage() {
  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4 text-black">Transaction Management</h1>
      <TransactionManager />
    </div>
  );
}
