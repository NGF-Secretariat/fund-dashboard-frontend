"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { createCurrency, deleteCurrency, loadCurrency, updateCurrency } from "../lib/currency";
import LoadingScreen from "./LoadingScreen";
import toast from "react-hot-toast";
import ConfirmPrompt from "./ConfirmPrompt";
import Modal from "./Modal";


export interface Currency {
  id: number;
  code: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default function CurrencyManager() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [form, setForm] = useState({ code: "", name: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [dropdownOpenId, setDropdownOpenId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [loading, setLoading] = useState<boolean>(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const mounted = useRef(false);
  const [modalOpen, setModalOpen] = useState(false);


  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await loadCurrency();
      setCurrencies(res.data.data);
    } catch (error) {
      toast.error("Failed to load currencies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mounted.current) {
      fetchData();
      mounted.current = true;
    }

    const closeOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpenId(null);
      }
    };
    document.addEventListener("mousedown", closeOutside);
    return () => document.removeEventListener("mousedown", closeOutside);
  }, [pathname]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.code || !form.name) {
      toast.error("All fields required");
      return;
    }

    setLoading(true);
    try {
      if (editingId !== null) {
        await updateCurrency(editingId, form);
        toast.success("Currency updated successfully");
        setEditingId(null);
      } else {
        await createCurrency(form);
        toast.success("Currency created successfully");
      }
      setForm({ code: "", name: "" });
      await fetchData();
    } catch {
      toast.error("Failed to save currency");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (currency: Currency) => {
    setForm({ code: currency.code, name: currency.name });
    setEditingId(currency.id);
    setDropdownOpenId(null);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (editingId === null) return;

    setShowConfirm(false);
    setLoading(true);
    try {
      await deleteCurrency(editingId);
      toast.success("Currency deleted");
      await fetchData();
    } catch (error) {
      toast.error("Failed to delete currency");
    } finally {
      setLoading(false);
      setEditingId(null);
    }
  };

  const cancelPrompt = () => {
    setShowConfirm(false);
    setEditingId(null);
  };

  const toggleDropdown = (id: number) => {
    setDropdownOpenId(dropdownOpenId === id ? null : id);
  };

  return (
    <>
      <div className="mx-auto text-black">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold mb-4 text-green-800">
            Currency</h2>

          <button
            onClick={() => {
              setForm({ code: "", name: "" })
              setEditingId(null);
              setModalOpen(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Add Currency
          </button>
        </div>


        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full table-auto border border-gray-200 bg-white">
            <thead className="bg-green-100">
              <tr>
                <th className="px-4 py-3 w-[2%] text-left text-gray-700">S/N</th>
                <th className="px-4 py-3 w-[45%] text-left text-gray-700">Code</th>
                <th className="px-4 py-3 w-[45%] text-left text-gray-700">Name</th>
                <th className="px-4 py-3 w-[8%] text-center  text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {currencies?.map((currency, index) => (
                <tr key={currency.id} className="border-t hover:bg-green-100">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{currency.code}</td>
                  <td className="px-4 py-3 capitalize">{currency.name}</td>
                  <td className="px-2 py-3 relative text-center">
                    <button
                      onClick={() => toggleDropdown(currency.id)}
                      className="text-lg font-bold px-2 text-green-800 hover:text-green-600"
                    >
                      ⋮
                    </button>
                    {dropdownOpenId === currency?.id && (
                      <div
                        ref={dropdownRef}
                        onMouseLeave={() => setDropdownOpenId(null)}
                        className="absolute right-2 mt-2 bg-white border border-green-800 rounded-lg shadow-lg z-20 w-32 transition-all"
                        style={{ transform: "translateY(4px)" }}
                      >
                        <button
                          onClick={() => handleEdit(currency)}
                          className="block cursor-pointer w-full px-3 py-2 text-left hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(currency.id);
                            setShowConfirm(true);
                          }}
                          className="block cursor-pointer w-full px-4 py-2 text-left hover:bg-red-100 text-sm text-red-500 rounded-lg"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {currencies?.length === 0 && (
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

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit" : "Add"}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-4 text-black"
        >
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Currency Code</label>
              <input
                type="text"
                name="code"
                value={form.code}
                onChange={handleChange}
                className="border border-green-300 bg-green-50 px-3 py-2 rounded-md w-full focus:ring-2 focus:ring-green-500"
                placeholder="e.g. NGN"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Currency Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="border border-green-300 bg-green-50 px-3 py-2 rounded-md w-full focus:ring-2 focus:ring-green-500"
                placeholder="e.g. Naira"
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
