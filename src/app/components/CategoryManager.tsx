"use client";

import { useState, useEffect, useRef } from "react";

// Dummy API
async function createCategory(category: any) {
  return { id: Math.random(), ...category };
}
async function updateCategory(id: number, category: any) {
  return { id, ...category };
}
async function deleteCategory(id: number) {
  return true;
}

interface Category {
  id: number;
  name: string;
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<Omit<Category, "id">>({ name: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [dropdownOpenId, setDropdownOpenId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ name: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return alert("Name is required");

    if (editingId !== null) {
      const updated = await updateCategory(editingId, form);
      setCategories((prev) =>
        prev.map((cat) => (cat.id === editingId ? updated : cat))
      );
      setEditingId(null);
    } else {
      const newCategory = await createCategory(form);
      setCategories((prev) => [...prev, newCategory]);
    }

    setForm({ name: "" });
  };

  const handleEdit = (category: Category) => {
    setForm({ name: category.name });
    setEditingId(category.id);
    setDropdownOpenId(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Delete this category?")) {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
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
    <div className="max-w-2xl mx-auto p-4 text-black">
      <h2 className="text-xl font-bold mb-4">{editingId ? "Edit" : "Add"} Category</h2>

      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="border px-3 py-2 rounded w-full"
          placeholder="Category name (e.g. Secretariat)"
        />
        <button
          onClick={handleSubmit}
          className="bg-textRed text-white px-4 py-2 rounded hover:bg-red-600"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      {/* Table */}
      <table className="w-full border rounded shadow text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border w-[90%] text-left">Name</th>
            <th className="px-4 py-2 border w-[10%] text-center">⋮</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td className="px-4 py-2 border">{cat.name}</td>
              <td className="px-2 py-2 border relative text-center">
                <button
                  onClick={() => toggleDropdown(cat.id)}
                  className="text-xl font-bold hover:text-gray-700"
                >
                  ⋮
                </button>
                {dropdownOpenId === cat.id && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-2 top-8 bg-white border rounded shadow z-10 w-24"
                  >
                    <button
                      onClick={() => handleEdit(cat)}
                      className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="block w-full px-3 py-2 text-left text-red-500 hover:bg-red-100"
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
  );
}
