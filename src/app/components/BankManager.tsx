"use client";

import { useEffect, useRef, useState } from "react";
import { createBank, deleteBank, loadBank, updateBank } from "../lib/bank";
import { usePathname } from "next/navigation";
import LoadingScreen from "./LoadingScreen";
import ConfirmPrompt from "./ConfirmPrompt";


interface Bank {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default function BankTableManager() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [dropdownOpenId, setDropdownOpenId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await loadBank();
      setBanks(res.data.data);
    } catch (error) {
      setError("Failed to load banks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
  }, [pathname]);

  if (loading) {
    return <LoadingScreen />;
  }

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    try {
      if (editingId !== null) {
        await updateBank(editingId, name);
        setEditingId(null);
      } else {
        await createBank(name);
      }
      await fetchData();
      setName("");
    } catch (error) {
      setError("Failed to save bank. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (bank: Bank) => {
    setName(bank.name);
    setEditingId(bank.id);
    setDropdownOpenId(null);
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteBank(id);
      await fetchData();
      setDropdownOpenId(null);
    } catch (error) {
      setError("Failed to delete bank. Please try again.");
    } finally {
      setLoading(false);
    }

  };

  const handleQuestion = () => {
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    setShowConfirm(false);
    handleDelete(editingId as number);
  };

  const cancelPrompt = () => {
    setShowConfirm(false);
  };

  const toggleDropdown = (id: number) => {
    setDropdownOpenId(dropdownOpenId === id ? null : id);
  };

  return (
    <>
      <div className="max-w-2xl mx-auto text-black">
        <h2 className="text-lg font-bold mb-4">
          {editingId ? "Edit Bank" : "Add New Bank"}
        </h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

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
                        onClick={() => {
                          handleQuestion(), setEditingId(bank.id);
                        }}
                        className="block w-full px-4 py-2 text-left hover:bg-red-100 text-sm text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {!loading && banks.length === 0 && (
              <tr>
                <td colSpan={2} className="text-center py-4 text-gray-500">
                  No banks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showConfirm && (
        <ConfirmPrompt message="Are you sure you want to delete this bank?"
          onConfirm={confirmDelete}
          onClose={cancelPrompt}
        />
      )}
    </>
  );
}
