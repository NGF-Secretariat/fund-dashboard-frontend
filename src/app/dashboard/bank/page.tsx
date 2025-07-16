// /app/dashboard/bank/page.tsx

import BankTableManager from "@/app/components/BankManager";
import React from "react";

export default function BankPage() {
  return (
    <div className="">
      <h3 className="text-lg font-bold mb-4 text-black">Bank Management</h3>
      <BankTableManager />
    </div>
  );
}
