"use client";

import { useEffect, useRef, useState } from "react";

// Replace with real API calls
async function createAccount(account: any) {
  return { id: Math.random(), ...account };
}
async function updateAccount(id: number, account: any) {
  return { id, ...account };
}
async function deleteAccount(id: number) {
  return true;
}

const bankOptions = [
  { id: 1, name: "Access Bank" },
  { id: 2, name: "Zenith Bank" },
];
const categoryOptions = [
  { id: 1, name: "Secretariat" },
  { id: 2, name: "Project" },
];
const currencyOptions = ["NGN", "USD", "GBP"];

interface Account {
  id: number;
  name: string;
  accountNumber: string;
  bankId: number;
  currencyCode: string;
  categoryId: number;
}

export default function AccountManager() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [form, setForm] = useState<Omit<Account, "id">>({
    name: "",
    accountNumber: "",
    bankId: 0,
    currencyCode: "NGN",
    categoryId: 0,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [dropdownOpenId, setDropdownOpenId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ["bankId", "categoryId"].includes(name) ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    const { name, accountNumber, bankId, currencyCode, categoryId } = form;
    if (!name || !accountNumber || !bankId || !categoryId) {
      alert("Please fill all fields");
      return;
    }

    if (editingId !== null) {
      const updated = await updateAccount(editingId, form);
      setAccounts((prev) =>
        prev.map((acc) => (acc.id === editingId ? updated : acc))
      );
      setEditingId(null);
    } else {
      const newAccount = await createAccount(form);
      setAccounts((prev) => [...prev, newAccount]);
    }

    setForm({
      name: "",
      accountNumber: "",
      bankId: 0,
      currencyCode: "NGN",
      categoryId: 0,
    });
  };

  const handleEdit = (account: Account) => {
    setForm({ ...account });
    setEditingId(account.id);
    setDropdownOpenId(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      await deleteAccount(id);
      setAccounts((prev) => prev.filter((a) => a.id !== id));
      setDropdownOpenId(null);
    }
  };

  const toggleDropdown = (id: number) => {
    setDropdownOpenId(dropdownOpenId === id ? null : id);
  };

  useEffect(() => {
    const closeOnOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpenId(null);
      }
    };
    document.addEventListener("mousedown", closeOnOutside);
    return () => document.removeEventListener("mousedown", closeOnOutside);
  }, []);

  const getBankName = (id: number) => bankOptions.find((b) => b.id === id)?.name || "";
  const getCategoryName = (id: number) => categoryOptions.find((c) => c.id === id)?.name || "";

  return (
    <div className="max-w-5xl mx-auto p-4 text-black">
      <h2 className="text-xl font-bold mb-4">{editingId ? "Edit Account" : "Add New Account"}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="border px-3 py-2 rounded w-full"
          placeholder="Account name"
        />
        <input
          type="text"
          name="accountNumber"
          value={form.accountNumber}
          onChange={handleChange}
          className="border px-3 py-2 rounded w-full"
          placeholder="Account number"
        />
        <select
          name="bankId"
          value={form.bankId}
          onChange={handleChange}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="">Select bank</option>
          {bankOptions.map((bank) => (
            <option key={bank.id} value={bank.id}>
              {bank.name}
            </option>
          ))}
        </select>
        <select
          name="currencyCode"
          value={form.currencyCode}
          onChange={handleChange}
          className="border px-3 py-2 rounded w-full"
        >
          {currencyOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="">Select category</option>
          {categoryOptions.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-textRed text-white px-4 py-2 rounded hover:bg-red-600"
      >
        {editingId ? "Update" : "Add"}
      </button>

      {/* Table */}
      <div className="mt-8">
        <table className="w-full border rounded shadow text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Account #</th>
              <th className="px-4 py-2 border">Bank</th>
              <th className="px-4 py-2 border">Currency</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border w-[5%] text-center">⋮</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc) => (
              <tr key={acc.id}>
                <td className="px-4 py-2 border">{acc.name}</td>
                <td className="px-4 py-2 border">{acc.accountNumber}</td>
                <td className="px-4 py-2 border">{getBankName(acc.bankId)}</td>
                <td className="px-4 py-2 border">{acc.currencyCode}</td>
                <td className="px-4 py-2 border">{getCategoryName(acc.categoryId)}</td>
                <td className="px-2 py-2 border relative text-center">
                  <button
                    onClick={() => toggleDropdown(acc.id)}
                    className="text-xl font-bold hover:text-gray-700"
                  >
                    ⋮
                  </button>
                  {dropdownOpenId === acc.id && (
                    <div
                      ref={dropdownRef}
                      className="absolute right-2 top-8 bg-white border rounded shadow z-10 w-28"
                    >
                      <button
                        onClick={() => handleEdit(acc)}
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(acc.id)}
                        className="block w-full px-4 py-2 text-left text-red-500 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {accounts.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No accounts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
