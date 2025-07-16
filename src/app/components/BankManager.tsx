"use client";

import { useEffect, useRef, useState } from "react";

// Dummy API Functions (replace with real API calls)
async function createBank(name: string) {
  return { id: Math.random(), name };
}
async function updateBank(id: number, name: string) {
  return { id, name };
}
async function deleteBank(id: number) {
  return true;
}

interface Bank {
  id: number;
  name: string;
}

export default function BankTableManager() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [dropdownOpenId, setDropdownOpenId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    if (!name.trim()) return;

    if (editingId !== null) {
      const updated = await updateBank(editingId, name);
      setBanks(banks.map((b) => (b.id === editingId ? updated : b)));
      setEditingId(null);
    } else {
      const newBank = await createBank(name);
      setBanks([...banks, newBank]);
    }

    setName("");
  };

  const handleEdit = (bank: Bank) => {
    setName(bank.name);
    setEditingId(bank.id);
    setDropdownOpenId(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this bank?")) {
      await deleteBank(id);
      setBanks(banks.filter((b) => b.id !== id));
      setDropdownOpenId(null);
    }
  };

  const toggleDropdown = (id: number) => {
    setDropdownOpenId(dropdownOpenId === id ? null : id);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="max-w-2xl mx-auto text-black">
      <h2 className="text-lg font-bold mb-4">
        {editingId ? "Edit Bank" : "Add New Bank"}
      </h2>

      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          value={name}
          placeholder="Enter bank name"
          onChange={(e) => setName(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={handleSubmit}
          className="bg-textRed text-white px-4 py-2 rounded"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      <table className="w-full table-auto border border-gray-200 rounded shadow">
        <thead className="bg-gray-100">
          <tr className="text-left">
            <th className="px-4 py-2 border w-[80%] text-left">Name</th>
            <th className="px-4 py-2 border w-[20%] text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {banks.map((bank) => (
            <tr key={bank.id} className="border-t">
              <td className="px-4 py-2 border w-[80%]">{bank.name}</td>
              <td className="px-4 py-2 border w-[20%] text-center relative">
                <button
                  onClick={() => toggleDropdown(bank.id)}
                  className="text-xl font-bold px-2 hover:text-gray-700"
                >
                  ⋮
                </button>

                {dropdownOpenId === bank.id && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-4 top-10 bg-white border rounded shadow z-10 w-28"
                  >
                    <button
                      onClick={() => handleEdit(bank)}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(bank.id)}
                      className="block w-full px-4 py-2 text-left hover:bg-red-100 text-sm text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
          {banks.length === 0 && (
            <tr>
              <td colSpan={2} className="text-center py-4 text-gray-500">
                No banks found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
