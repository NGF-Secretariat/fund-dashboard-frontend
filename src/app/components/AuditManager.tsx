"use client";

import { useEffect, useRef, useState } from "react";
import { formatAmount } from "./TransactionManager";
import { usePathname } from "next/navigation";
import { loadAudit } from "../lib/audit";
import LoadingScreen from "./LoadingScreen";
import { loadUser } from "../lib/user";
import { strict } from "assert";
import toast from "react-hot-toast";

export interface AuditLog {
  id: number;
  entityType: string;
  entityId: number;
  action: "CREATE" | "UPDATE" | "DELETE";
  fieldChanged: string | null;
  oldValue: string | null;
  newValue: string | null;
  description: string;
  createdBy: {
    id: number;
    name: string;
    email: string;
    passwordHash: string;
    role: "admin" | "user" | "acct" | "audit" | string;
    createdAt: string;
  };
  createdAt: string;
}

export interface User {
  createdAt: string;
  email: string;
  id: number;
  name: string;
  role: string;
}

export default function AuditLogTable() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const pathname = usePathname();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(false);

  const fetchAudit = async () => {
    try {
      setLoading(true);

      const res = await loadAudit();
      setLogs(res.data.data);
    } catch (error) {
      console.log("error", error);
      toast.error("Can not load users, please try again");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mounted.current) {
      fetchAudit();
      mounted.current = true;
    }
  }, [pathname]);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { startDate, endDate, page, limit };
      if (selectedUser) {
        params.user = Number(selectedUser);
      }
      const res = await loadAudit(params);
      setLogs(res.data.data);
    } catch (error) {
      toast.error("Failed to load audit logs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto text-black">
      <h2 className="text-lg font-bold mb-4 text-black">Audit Log</h2>

      <div className="w-full mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-green-300 bg-green-50 px-3 py-2 rounded-md w-full focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-green-300 bg-green-50 px-3 py-2 rounded-md w-full focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Limit</label>
            <input
              type="number"
              min={1}
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value))}
              className="border border-green-300 bg-green-50 px-3 py-2 rounded-md w-full focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Page</label>
            <input
              type="number"
              min={1}
              value={page}
              onChange={(e) => setPage(parseInt(e.target.value))}
              className="border border-green-300 bg-green-50 px-3 py-2 rounded-md w-full focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">User</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="border border-green-300 bg-green-50 px-3 py-2 rounded-md w-full focus:ring-2 focus:ring-green-500"
            >
              <option value="">All</option>
              {users.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex md:justify-end w-full mt-2 md:mt-0">
            <button
              onClick={handleSearch}
              className="bg-textRed text-white px-4 py-2 rounded hover:bg-red-600 w-full md:w-auto"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full table-auto border border-gray-200 bg-white">
          <thead className="bg-green-100">
            <tr>
              <th className="px-4 py-3 text-gray-700 text-left">S/N</th>
              <th className="px-4 py-3 text-gray-700 text-center">Date</th>
              <th className="px-4 py-3 text-gray-700 text-center">
                Entity Type
              </th>
              <th className="px-4 py-3 text-gray-700 text-center">Action</th>
              <th className="px-4 py-3 text-gray-700 text-center">
                Field Changed
              </th>
              <th className="px-4 py-3 text-gray-700 text-center">Old Value</th>
              <th className="px-4 py-3 text-gray-700 text-center">New Value</th>
              <th className="px-4 py-3 text-gray-700 text-center">
                Description
              </th>
              <th className="px-4 py-3 text-gray-700 text-center">Done By</th>
            </tr>
          </thead>
          <tbody className="text-black">
            {logs?.map((log, index) => (
              <tr key={log.id} className="border-t hover:bg-green-100">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3 text-center">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-center capitalize">
                  {log.entityType}
                </td>
                <td
                  className={`px-4 py-3 font-semibold text-center ${
                    log.action === "CREATE"
                      ? "text-green-600"
                      : log.action === "UPDATE"
                      ? "text-blue-600"
                      : "text-red-600"
                  }`}
                >
                  {log.action}
                </td>
                <td className="px-4 py-3 text-center">
                  {log.fieldChanged || "-"}
                </td>
                <td className="px-4 py-3 text-gray-600 text-center">
                  {typeof log.oldValue === "number"
                    ? formatAmount(log.oldValue)
                    : log.oldValue || "-"}
                </td>
                <td className="px-4 py-3 text-gray-900 text-center">
                  {typeof log.newValue === "number"
                    ? formatAmount(log.newValue)
                    : log.newValue || "-"}
                </td>
                <td className="px-4 py-3">{log.description || "-"}</td>
                <td className="px-4 py-3 text-center">
                  {log.createdBy?.name || "-"} <br className="md:hidden" />{" "}
                  <span className="text-xs text-gray-500">
                    {log.createdBy?.email || "-"}
                  </span>
                </td>
              </tr>
            ))}
            {logs?.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  No audit records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {loading && <LoadingScreen text="Processing..." />}
      </div>
    </div>
  );
}
