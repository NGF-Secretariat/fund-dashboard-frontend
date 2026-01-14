"use client";

import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  createTransaction,
  deleteTransaction,
  loadTransaction,
  updateTransaction,
} from "../lib/transaction";
import LoadingScreen from "./LoadingScreen";
import toast from "react-hot-toast";
import { loadAccount } from "../lib/account";
import ConfirmPrompt from "./ConfirmPrompt";
import Modal from "./Modal";
import { Account } from "./Accountmanager";
import { FaSlidersH } from "react-icons/fa";

export interface Transaction {
  id: number;
  account: {
    id: number;
    name: string;
    currency: {
      id: number;
      code: string;
      name: string;
      createdAt: string; // ISO Date
      updatedAt: string; // ISO Date
    };
    bank: {
      id: number;
      name: string;
    };
  };
  type: "inflow" | "outflow";
  amount: string; // or number, depending on usage
  previousBalance: string; // or number
  currentBalance: string; // or number
  description: string;
  createdBy: {
    id: number;
    name: string;
    email: string;
    passwordHash: string;
    role: "user" | "acct" | "audit"; // or broader enum
    createdAt: string;
  };
  createdAt: string;
}

export function formatAmountWithCurrency(
  amount: string | number,
  currency: string = "USD"
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(Number(amount));
}
export function formatAmount(amount: string | number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
  }).format(Number(amount));
}

export default function TransactionManager() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [form, setForm] = useState({
    accountId: 0,
    type: "",
    amount: 0,
    description: "",
  });
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [dropdownOpenId, setDropdownOpenId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const mounted = useRef(false);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await loadTransaction();
      setTransactions(res.data.data);
    } catch (error) {
      toast.error("Failed to load transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await loadAccount();
      setAccounts(res.data.data);
    } catch (error) {
      setError("Failed to load banks. Please try again.");
      toast.error("Failed to load banks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mounted.current) {
      fetchData();
      load();
      mounted.current = true;
    }

    const closeOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpenId(null);
      }
    };
    document.addEventListener("mousedown", closeOutside);
    return () => document.removeEventListener("mousedown", closeOutside);
  }, [pathname]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" || name === "accountId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.amount || !form.description) {
      toast.error("All fields required");
      return;
    }

    setLoading(true);
    try {
      if (editingId !== null) {
        await updateTransaction(editingId, form);
        toast.success("Transaction updated successfully");
        setEditingId(null);
      } else {
        const newTxn = await createTransaction(form);
        toast.success("Transaction added successfully");
      }
      setForm({ accountId: 0, type: "inflow", amount: 0, description: "" });
      await fetchData();
    } catch (error) {
      toast.error("Failed to save transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (txn: Transaction) => {
    setForm({
      accountId: Number(txn.account.id),
      type: txn.type,
      amount: Number(txn.amount),
      description: txn.description,
    });
    setEditingId(txn.id);
    setDropdownOpenId(null);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (editingId === null) return;

    setShowConfirm(false);
    setLoading(true);
    try {
      await deleteTransaction(editingId);
      toast.success("Transaction deleted");
      await fetchData();
    } catch (error) {
      toast.error("Failed to delete transaction. Please try again.");
    } finally {
      setDropdownOpenId(null);
      setLoading(false);
    }
  };

  const cancelPrompt = () => {
    setShowConfirm(false);
    setEditingId(null);
  };

  const toggleDropdown = (id: number) => {
    setDropdownOpenId(dropdownOpenId === id ? null : id);
  };

  const filteredTransactions = transactions?.filter(
    (txn) =>
      txn.description.toLowerCase().includes(search.toLowerCase()) ||
      txn.account.name.toLowerCase().includes(search.toLowerCase()) ||
      txn.amount.toString().includes(search)
  );

  return (
    <>
      <div className="mx-auto text-black">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold mb-4 text-green-800">Transaction</h2>
          <button
            onClick={() => {
              setForm({
                accountId: 0,
                type: "",
                amount: 0,
                description: "",
              });
              setEditingId(null);
              setModalOpen(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Add Transaction
          </button>
        </div>

        <div className="flex justify-end items-center mb-4">
          <input
            type="text"
            placeholder="Search by name or account name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-green-300 bg-green-50 px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500 w-full max-w-xs"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full table-auto border border-gray-200 bg-white">
            <thead className="bg-green-100">
              <tr>
                <th className="px-4 py-3 text-gray-700 text-left">S/N</th>
                <th className="px-4 py-3 text-gray-700">Account</th>
                <th className="px-4 py-3 text-gray-700">Type</th>
                <th className="px-4 py-3 text-gray-700">Amount</th>
                <th className="px-4 py-3 text-gray-700">Description</th>
                <th className="px-4 py-3 text-gray-700 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions?.map((txn, index) => (
                <tr key={txn.id} className="border-t hover:bg-green-100">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 capitalize">{txn.account.name}</td>
                  <td className="px-4 py-3 capitalize">{txn.type}</td>
                  <td className="px-4 py-3">{formatAmount(txn.amount)}</td>
                  <td className="px-4 py-3 capitalize">{txn.description}</td>
                  <td className="px-2 py-3 relative text-center">
                    <button
                      onClick={() => toggleDropdown(txn.id)}
                      className="text-xl font-bold hover:text-gray-700"
                    >
                      <FaSlidersH />
                    </button>
                    {dropdownOpenId === txn.id && (
                      <section
                        ref={dropdownRef}
                        onMouseLeave={() => setDropdownOpenId(null)}
                        className="absolute right-2 mt-2 bg-white border border-green-800 rounded-lg shadow-lg z-20 w-32 transition-all"
                        style={{ transform: "translateY(4px)" }}
                      >
                        <button
                          onClick={() => handleEdit(txn)}
                          className="block cursor-pointer w-full px-3 py-2 text-left hover:bg-gray-100 rounded-lg"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(txn.id);
                            setShowConfirm(true);
                          }}
                          className="block cursor-pointer w-full px-3 py-2 text-left text-red-500 hover:bg-red-100 rounded-lg"
                        >
                          Delete
                        </button>
                      </section>
                    )}
                  </td>
                </tr>
              ))}
              {filteredTransactions?.length === 0 && (
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

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit" : "Add"}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-4 text-black"
        >
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Select Account
              </label>
              <select
                name="accountId"
                value={form.accountId}
                onChange={handleChange}
                className="border border-green-300 bg-green-50 px-3 py-2 rounded-md w-full focus:ring-2 focus:ring-green-500"
              >
                {accounts?.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Transaction Type
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="border border-green-300 bg-green-50 px-3 py-2 rounded-md w-full focus:ring-2 focus:ring-green-500"
              >
                <option value="">Please select</option>
                <option value="inflow">Inflow</option>
                <option value="outflow">Outflow</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className="border border-green-300 bg-green-50 px-3 py-2 rounded-md w-full focus:ring-2 focus:ring-green-500"
                placeholder="Amount"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
                className="border border-green-300 bg-green-50 px-3 py-2 rounded-md w-full focus:ring-2 focus:ring-green-500"
                placeholder="Description"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-textRed text-white px-4 py-2 rounded hover:bg-red-600"
            >
              {editingId ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </Modal>

      {showConfirm && (
        <ConfirmPrompt
          message="Are you sure you want to delete this currency?"
          onConfirm={confirmDelete}
          onClose={cancelPrompt}
        />
      )}

      {loading && <LoadingScreen text="Processing..." />}
    </>
  );
}
