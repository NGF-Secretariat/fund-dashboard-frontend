// /app/dashboard/bank/page.tsx

import TransactionManager from "@/app/components/TransactionManager";
import React from "react";
import { Toaster } from "react-hot-toast";

export default function TransactionPage() {
  return (
    <div >
      <Toaster position="top-right" />
      <h1 className="text-lg font-bold mb-4 text-black">Transaction Management</h1>
      <TransactionManager />
    </div>
  );
}
