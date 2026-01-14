
import AuditLogTable from "@/app/components/AuditManager";
import React from "react";

export default function AuditPage() {
  return (
    <div>
      <h1 className="text-lg font-bold mb-4 text-black">AuditLog  Management</h1>
      <AuditLogTable />
    </div>
  );
}
