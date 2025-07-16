
import CategoryManager from "@/app/components/CategoryManager";
import React from "react";

export default function CategoryPage() {
  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4 text-black">Category Management</h1>
      <CategoryManager />
    </div>
  );
}
