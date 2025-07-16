"use client";

import { useState, useEffect, useRef } from "react";

// Dummy API (replace with real calls)
async function createCurrency(currency: any) {
  return { id: Math.random(), ...currency };
}
async function updateCurrency(id: number, currency: any) {
  return { id, ...currency };
}
async function deleteCurrency(id: number) {
  return true;
}

interface Currency {
  id: number;
  code: string;
  name: string;
}

export default function CurrencyManager() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [form, setForm] = useState<Omit<Currency, "id">>({ code: "", name: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [dropdownOpenId, setDropdownOpenId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value.toUpperCase() }));
  };

  const handleSubmit = async () => {
    if (!form.code || !form.name) return alert("All fields required");

    if (editingId !== null) {
      const updated = await updateCurrency(editingId, form);
      setCurrencies((prev) =>
        prev.map((c) => (c.id === editingId ? updated : c))
      );
      setEditingId(null);
    } else {
      const newCurrency = await createCurrency(form);
      setCurrencies((prev) => [...prev, newCurrency]);
    }

    setForm({ code: "", name: "" });
  };

  const handleEdit = (currency: Currency) => {
    setForm({ code: currency.code, name: currency.name });
    setEditingId(currency.id);
    setDropdownOpenId(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Delete this currency?")) {
      await deleteCurrency(id);
      setCurrencies((prev) => prev.filter((c) => c.id !== id));
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
    <div className="max-w-3xl mx-auto p-4 text-black">
      <h2 className="text-xl font-bold mb-4">{editingId ? "Edit" : "Add"} Currency</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          name="code"
          value={form.code}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
          placeholder="Currency code (e.g. NGN)"
        />
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
          placeholder="Currency name (e.g. Naira)"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-textRed text-white px-4 py-2 rounded hover:bg-red-600"
      >
        {editingId ? "Update" : "Add"}
      </button>

      {/* Currency Table */}
      <div className="mt-8">
        <table className="w-full border rounded shadow text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border w-[45%] text-left">Code</th>
              <th className="px-4 py-2 border w-[45%] text-left">Name</th>
              <th className="px-4 py-2 border w-[10%] text-center">⋮</th>
            </tr>
          </thead>
          <tbody>
            {currencies.map((currency) => (
              <tr key={currency.id}>
                <td className="px-4 py-2 border">{currency.code}</td>
                <td className="px-4 py-2 border">{currency.name}</td>
                <td className="px-2 py-2 border relative text-center">
                  <button
                    onClick={() => toggleDropdown(currency.id)}
                    className="text-xl font-bold hover:text-gray-700"
                  >
                    ⋮
                  </button>
                  {dropdownOpenId === currency.id && (
                    <div
                      ref={dropdownRef}
                      className="absolute right-2 top-8 bg-white border rounded shadow z-10 w-24"
                    >
                      <button
                        onClick={() => handleEdit(currency)}
                        className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(currency.id)}
                        className="block w-full px-3 py-2 text-left text-red-500 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {currencies.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-500">
                  No currencies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
