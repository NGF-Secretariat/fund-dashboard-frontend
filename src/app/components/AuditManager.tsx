"use client";

import { useEffect, useState } from "react";

// Replace this with your actual API call
async function fetchAuditLogs(): Promise<AuditLog[]> {
  return [
    {
      id: 1,
      entityType: "transaction",
      entityId: 101,
      action: "UPDATE",
      fieldChanged: "amount",
      oldValue: "5000",
      newValue: "5500",
      description: "Updated transaction amount",
    },
    {
      id: 2,
      entityType: "account",
      entityId: 33,
      action: "CREATE",
      fieldChanged: "",
      oldValue: "",
      newValue: "",
      description: "Created new account",
    },
  ];
}

interface AuditLog {
  id: number;
  entityType: string;
  entityId: number;
  action: "CREATE" | "UPDATE" | "DELETE";
  fieldChanged?: string | null;
  oldValue?: string | null;
  newValue?: string | null;
  description?: string | null;
}

export default function AuditLogTable() {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetchAuditLogs();
      setLogs(res);
    }
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Audit Log</h2>
      <div className="overflow-auto rounded shadow border border-gray-200">
        <table className="min-w-full text-sm text-left table-auto">
          <thead className="bg-gray-100 text-gray-800 font-medium">
            <tr>
              <th className="px-4 py-2 border">Entity Type</th>
              <th className="px-4 py-2 border">Entity ID</th>
              <th className="px-4 py-2 border">Action</th>
              <th className="px-4 py-2 border">Field Changed</th>
              <th className="px-4 py-2 border">Old Value</th>
              <th className="px-4 py-2 border">New Value</th>
              <th className="px-4 py-2 border">Description</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 border">{log.entityType}</td>
                <td className="px-4 py-2 border">{log.entityId}</td>
                <td
                  className={`px-4 py-2 border font-semibold ${
                    log.action === "CREATE"
                      ? "text-green-600"
                      : log.action === "UPDATE"
                      ? "text-blue-600"
                      : "text-red-600"
                  }`}
                >
                  {log.action}
                </td>
                <td className="px-4 py-2 border">{log.fieldChanged || "-"}</td>
                <td className="px-4 py-2 border text-gray-600">{log.oldValue || "-"}</td>
                <td className="px-4 py-2 border text-gray-900">{log.newValue || "-"}</td>
                <td className="px-4 py-2 border">{log.description || "-"}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  No audit records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
