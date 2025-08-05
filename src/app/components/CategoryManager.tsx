"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  createCategory,
  deleteCategory,
  loadACategory,
  updateCategory,
} from "../lib/category";
import LoadingScreen from "./LoadingScreen";
import toast from "react-hot-toast";
import ConfirmPrompt from "./ConfirmPrompt";
import Modal from "./Modal";


export interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ name: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [dropdownOpenId, setDropdownOpenId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [loading, setLoading] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const mounted = useRef(false);
  const [modalOpen, setModalOpen] = useState(false);


  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await loadACategory();
      setCategories(res.data.data);
    } catch (error) {
      toast.error("Failed to load banks. Please try again.");
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ name: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setLoading(true);
      if (editingId !== null) {
        await updateCategory(editingId, form);
        toast.success("Category updated successfully");
        setEditingId(null);
      } else {
        await createCategory(form);
        toast.success("Category created successfully");
      }
      setForm({ name: "" });
      await fetchData();
    } catch (error) {
      toast.error("Failed to save categories");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setForm({ name: category.name });
    setEditingId(category.id);
    setDropdownOpenId(null);
    setModalOpen(true);

  };

  const confirmDelete = async () => {
    if (editingId === null) return;

    setShowConfirm(true);
    setLoading(true);
    try {
      await deleteCategory(editingId);
      toast.success("Category deleted");
      await fetchData();
    } catch (error) {
      toast.error("Failed to delete category. Please try again.");
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

  return (
    <>
      <div className="mx-auto text-black">
        <div className="flex justify-between items-center mb-4">

          <h2 className="text-lg font-bold mb-4 text-green-800">
            Category
          </h2>
          <button
            onClick={() => {
              setForm({ name: "" })
              setEditingId(null);
              setModalOpen(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Add Currency
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full table-auto border border-gray-200 bg-white">
            <thead className="bg-green-100">
              <tr>
                <th className="px-4 py-3 text-gray-700 w-[2%] text-left">
                  S/N
                </th>
                <th className="px-4 py-3 text-gray-700 w-[90%] text-left">
                  Name
                </th>
                <th className="px-4 py-3 text-gray-700 w-[8%] text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, index) => (
                <tr key={cat.id} className="border-t hover:bg-green-100">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 capitalize">{cat.name}</td>
                  <td className="px-2 py-3 relative text-center">
                    <button
                      onClick={() => toggleDropdown(cat.id)}
                      className="text-xl font-bold hover:text-gray-700"
                    >
                      ⋮
                    </button>
                    {dropdownOpenId === cat.id && (
                      <div
                        onMouseLeave={() => setDropdownOpenId(null)}
                        className="absolute right-2 mt-2 bg-white border border-green-800 rounded-lg shadow-lg z-20 w-32 transition-all"
                        style={{ transform: "translateY(4px)" }}
                      >
                        <button
                          onClick={() => handleEdit(cat)}
                          className="block cursor-pointer w-full px-3 py-2 text-left hover:bg-gray-100 rounded-lg"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(cat.id);
                            setShowConfirm(true);
                          }}
                          className="block cursor-pointer w-full px-3 py-2 text-left text-red-500 hover:bg-red-100 rounded-lg"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={2} className="text-center py-4 text-gray-500">
                    No categories found.
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
              <label className="block text-sm font-medium mb-1">Category name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="border border-green-300 bg-green-50 px-3 py-2 rounded-md w-full focus:ring-2 focus:ring-green-500"
                placeholder="Category name (e.g. Secretariat)"
              />
            </div>
          </div>
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                className="bg-textRed text-white px-4 py-2 mt-6 rounded hover:bg-red-600"
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
