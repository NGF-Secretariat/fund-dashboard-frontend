"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { createBank, deleteBank, loadBank, updateBank } from "../lib/bank";
import { usePathname } from "next/navigation";
import LoadingScreen from "./LoadingScreen";
import ConfirmPrompt from "./ConfirmPrompt";
import Modal from "./Modal";

export interface Bank {
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
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const initialLoad = useRef(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await loadBank();
      setBanks(res.data.data);
    } catch {
      toast.error("Failed to load banks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialLoad.current) {
      fetchData();
      initialLoad.current = true;
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpenId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [pathname]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Bank name cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      if (editingId !== null) {
        await updateBank(editingId, name);
        toast.success("Bank updated successfully");
        setEditingId(null);
      } else {
        await createBank(name);
        toast.success("Bank created successfully");
      }
      setName("");
      await fetchData();
      setModalOpen(false);
    } catch {
      toast.error("Failed to save bank");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (bank: Bank) => {
    setName(bank.name);
    setEditingId(bank.id);
    setDropdownOpenId(null);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteId === null) return;

    setShowConfirm(false);
    setLoading(true);
    try {
      await deleteBank(deleteId);
      toast.success("Bank deleted");
      await fetchData();
    } catch {
      toast.error("Failed to delete bank");
    } finally {
      setLoading(false);
      setDeleteId(null);
    }
  };

  const cancelPrompt = () => {
    setShowConfirm(false);
    setDeleteId(null);
  };

  const toggleDropdown = (id: number) => {
    setDropdownOpenId(dropdownOpenId === id ? null : id);
  };

  return (
    <>
      <div className="mx-auto text-black">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-green-800">Banks</h2>
          <button
            onClick={() => {
              setName("");
              setEditingId(null);
              setModalOpen(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Add Bank
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full table-auto border border-gray-200 bg-white">
            <thead className="bg-green-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-sm text-gray-700">S/N</th>
                <th className="px-4 py-3 text-left font-semibold text-sm text-gray-700">Bank Name</th>
                <th className="px-4 py-3 text-center font-semibold text-sm text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {banks?.map((bank, index) => (
                <tr key={bank.id} className="border-t hover:bg-green-100">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 capitalize">{bank.name}</td>
                  <td className="px-4 py-3 text-center relative">
                    <button
                      onClick={() => toggleDropdown(bank.id)}
                      className="text-lg font-bold px-2 text-green-800 hover:text-green-600"
                    >
                      ⋮
                    </button>

                    {dropdownOpenId === bank.id && (
                      <div
                        ref={dropdownRef}
                        onMouseLeave={() => setDropdownOpenId(null)}
                        className="absolute right-2 mt-2 bg-white border border-green-800 rounded-lg shadow-lg z-20 w-32 transition-all"
                        style={{ transform: "translateY(4px)" }}
                      >
                        <button
                          onClick={() => handleEdit(bank)}
                          className="block w-full px-4 py-2 text-left hover:bg-green-100 text-sm rounded-lg"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setDeleteId(bank.id);
                            setShowConfirm(true);
                          }}
                          className="block w-full px-4 py-2 text-left hover:bg-red-100 text-sm text-red-500 rounded-lg"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && banks?.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-gray-500">
                    No banks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Bank" : "Add New Bank"}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1 text-black">Bank Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border text-black border-green-300 bg-green-50 px-3 py-2 rounded-md w-full focus:ring-2 focus:ring-green-500"
              placeholder="Enter bank name"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 px-4 py-2 rounded-md hover:bg-green-700"
            >
              {editingId ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </Modal>

      {showConfirm && (
        <ConfirmPrompt
          message="Are you sure you want to delete this bank?"
          onConfirm={confirmDelete}
          onClose={cancelPrompt}
        />
      )}

      {loading && <LoadingScreen fullscreen text="Processing..." />}
    </>
  );
}
