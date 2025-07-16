"use client";

import { useState, useRef, useEffect } from "react";

// Dummy APIs — replace with real API calls
async function createTransaction(txn: any) {
  return { id: Math.random(), ...txn };
}
async function updateTransaction(id: number, txn: any) {
  return { id, ...txn };
}
async function deleteTransaction(id: number) {
  return true;
}

// Dummy account options
const dummyAccounts = [
  { id: 1, name: "NGF Secretariat Naira" },
  { id: 2, name: "NGF GAVI USD" },
];

interface Transaction {
  id: number;
  accountId: number;
  type: "inflow" | "outflow";
  amount: number;
  description: string;
}

export default function TransactionManager() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [form, setForm] = useState<Omit<Transaction, "id">>({
    accountId: 1,
    type: "inflow",
    amount: 0,
    description: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [dropdownOpenId, setDropdownOpenId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" || name === "accountId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.amount || !form.description) return alert("All fields required");

    if (editingId !== null) {
      const updated = await updateTransaction(editingId, form);
      setTransactions((prev) =>
        prev.map((tx) => (tx.id === editingId ? updated : tx))
      );
      setEditingId(null);
    } else {
      const newTxn = await createTransaction(form);
      setTransactions((prev) => [...prev, newTxn]);
    }

    setForm({ accountId: 1, type: "inflow", amount: 0, description: "" });
  };

  const handleEdit = (txn: Transaction) => {
    setForm({
      accountId: txn.accountId,
      type: txn.type,
      amount: txn.amount,
      description: txn.description,
    });
    setEditingId(txn.id);
    setDropdownOpenId(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Delete this transaction?")) {
      await deleteTransaction(id);
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
      setDropdownOpenId(null);
    }
  };

  const toggleDropdown = (id: number) => {
    setDropdownOpenId(dropdownOpenId === id ? null : id);
  };

  useEffect(() => {
    const closeOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpenId(null);
      }
    };
    document.addEventListener("mousedown", closeOutside);
    return () => document.removeEventListener("mousedown", closeOutside);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 text-black">
      <h2 className="text-xl font-bold mb-4">
        {editingId ? "Edit" : "Add"} Transaction
      </h2>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <select
          name="accountId"
          value={form.accountId}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        >
          {dummyAccounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.name}
            </option>
          ))}
        </select>

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        >
          <option value="inflow">Inflow</option>
          <option value="outflow">Outflow</option>
        </select>

        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
          placeholder="Amount"
        />
        <input
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
          placeholder="Description"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-textRed text-white px-4 py-2 rounded hover:bg-red-600"
      >
        {editingId ? "Update" : "Add"}
      </button>

      {/* Table */}
      <div className="mt-8 overflow-auto">
        <table className="w-full border rounded shadow text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Account</th>
              <th className="px-4 py-2 border">Type</th>
              <th className="px-4 py-2 border">Amount</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border text-center">⋮</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id}>
                <td className="px-4 py-2 border">
                  {dummyAccounts.find((a) => a.id === txn.accountId)?.name ?? "N/A"}
                </td>
                <td className="px-4 py-2 border capitalize">{txn.type}</td>
                <td className="px-4 py-2 border">₦{txn.amount.toLocaleString()}</td>
                <td className="px-4 py-2 border">{txn.description}</td>
                <td className="px-2 py-2 border relative text-center">
                  <button
                    onClick={() => toggleDropdown(txn.id)}
                    className="text-xl font-bold hover:text-gray-700"
                  >
                    ⋮
                  </button>
                  {dropdownOpenId === txn.id && (
                    <div
                      ref={dropdownRef}
                      className="absolute right-2 top-8 bg-white border rounded shadow z-10 w-24"
                    >
                      <button
                        onClick={() => handleEdit(txn)}
                        className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(txn.id)}
                        className="block w-full px-3 py-2 text-left text-red-500 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
