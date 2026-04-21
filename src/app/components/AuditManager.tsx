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
  const [limit, setLimit] = useState<number>(50);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);
  const pathname = usePathname();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(false);

  const fetchAudit = async (p = page, l = limit) => {
    try {
      setLoading(true);
      const params: any = { startDate, endDate, page: p, limit: l, };
      if (selectedUser) {
        params.userId = Number(selectedUser);
      }
      const res = await loadAudit(params);
      if (res.success) {
        setLogs(res.data.data);
        // Assuming meta structure based on common NestJS patterns
        if (res.data.meta) {
          setTotalPages(res.data.meta.lastPage || res.data.meta.totalPages || 1);
        } else if (res.data.totalPages) {
          setTotalPages(res.data.totalPages);
        }
      } else {
        toast.error(res.message || "Failed to load audit logs");
      }
    } catch (error) {
      toast.error("Failed to load audit logs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await loadUser();
      if (res.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.error("Failed to load users", error);
    }
  };

  useEffect(() => {
    fetchAudit();
  }, [page, limit, pathname]);

  useEffect(() => {
    if (!mounted.current) {
      loadUsers();
      mounted.current = true;
    }
  }, []);

  const handleSearch = () => {
    if (page !== 1) {
      setPage(1);
    } else {
      fetchAudit();
    }
  };

  return (
    <div className="mx-auto text-black">
      <h2 className="text-lg font-bold mb-4 text-black">Audit Log</h2>

      <div className="w-full mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-green-300 bg-green-50 px-3 py-2 rounded-md w-full focus:ring-2 focus:ring-green-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-green-300 bg-green-50 px-3 py-2 rounded-md w-full focus:ring-2 focus:ring-green-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">User</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="border border-green-300 bg-green-50 px-3 py-2 rounded-md w-full focus:ring-2 focus:ring-green-500 outline-none transition-all"
            >
              <option value="">All Users</option>
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
              className="bg-textRed text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors w-full md:w-auto font-semibold shadow-sm"
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
                <td className="px-4 py-3">{(page - 1) * limit + index + 1}</td>
                <td className="px-4 py-3 text-center">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-center capitalize">
                  {log.entityType}
                </td>
                <td
                  className={`px-4 py-3 font-semibold text-center ${log.action === "CREATE"
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

      <div className="flex justify-between items-center mt-6 text-sm text-gray-700 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center gap-2">
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="border border-green-300 bg-green-50 px-3 py-1.5 rounded-md outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium"
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>

        <div className="font-medium text-gray-600">
          page {page} of page {totalPages}
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 font-semibold text-green-700 hover:text-green-900 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            pre &lt;
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || totalPages === 0}
            className="flex items-center gap-1 font-semibold text-green-700 hover:text-green-900 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            next &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
