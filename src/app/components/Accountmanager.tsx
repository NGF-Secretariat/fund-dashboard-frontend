"use client";

import { useEffect, useRef, useState } from "react";
import LoadingScreen from "./LoadingScreen";
import {
  createAccount,
  deleteAccount,
  loadAccount,
  updateAccount,
} from "../lib/account";
import { usePathname } from "next/navigation";
import { loadBank } from "../lib/bank";
import { Bank } from "./BankManager";
import { loadCurrency } from "../lib/currency";
// import { Currency } from "./CurrencyManager";
import toast from "react-hot-toast";
import { loadACategory } from "../lib/category";
import { Category } from "./CategoryManager";
import ConfirmPrompt from "./ConfirmPrompt";
import Modal from "./Modal";
import { Currency } from "./Currencymanager";


export interface Account {
  id: number;
  name: string;
  accountNumber: string;
  bank: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  currency: {
    id: number;
    code: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  category: {
    id: number;
    name: string;
  };
  createdBy: {
    id: number;
    name: string;
    email: string;
    passwordHash: string;
    role: string;
    createdAt: string;
  };
  balance: string;
  createdAt: string;
  updatedAt: string;
}

export default function AccountManager() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [form, setForm] = useState({
    name: "",
    accountNumber: "",
    bankId: 0,
    currencyCode: "",
    categoryId: 0,
  });
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [dropdownOpenId, setDropdownOpenId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const pathname = usePathname;
  const [banks, setBanks] = useState<Bank[]>([]);
  const mounted = useRef(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);


  const fetchBank = async () => {
    try {
      const res = await loadBank();
      setBanks(res.data.data);
    } catch (error) {
      toast.error("Failed to load banks. Please try again.");
    }
  };

  const fetchCategory = async () => {
    try {
      const res = await loadACategory();
      setCategories(res.data.data);
    } catch (error) {
      toast.error("Failed to load categories. Please try again.");
    }
  };

  const fetchAccount = async () => {
    try {
      setLoading(true);
      const res = await loadAccount();
      setAccounts(res.data.data);
      console.log(accounts);
    } catch (error) {
      toast.error("Failed to load accounts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrency = async () => {
    try {
      const res = await loadCurrency();
      setCurrencies(res.data.data);
    } catch (error) {
      toast.error("Failed to load currencies. Please try again.");
    }
  };

  useEffect(() => {
    if (!mounted.current) {
      fetchBank();
      fetchAccount();
      fetchCurrency();
      fetchCategory();
      mounted.current = true;
    }

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
  }, [pathname]);

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
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      if (editingId !== null) {
        const updated = await updateAccount(editingId, form);
        toast.success("Account updated successfully");
        setEditingId(null);
      } else {
        const newAccount = await createAccount(form);
        toast.success("Account created successfully");
      }
      setForm({
        name: "",
        accountNumber: "",
        bankId: 0,
        currencyCode: "",
        categoryId: 0,
      });
      await fetchAccount();
    } catch (error) {
      toast.error("Failed to save account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (account: Account) => {
    setForm({
      name: account.name,
      accountNumber: account.accountNumber,
      bankId: Number(account.bank.id),
      currencyCode: account.currency.code,
      categoryId: Number(account.category.id),
    });
    setEditingId(account.id);
    setDropdownOpenId(null);
    setModalOpen(true);

  };


  const confirmDelete = async () => {
    if (editingId === null) return;

    setShowConfirm(false);
    setLoading(true);
    try {
      await deleteAccount(editingId);
      toast.success("Account deleted");
      await fetchAccount();
    } catch (error) {
      toast.error("Failed to delete account. Please try again.");
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

  const filteredAccounts = accounts.filter(
    (acc) =>
      acc.name.toLowerCase().includes(search.toLowerCase()) ||
      acc.accountNumber.includes(search)
  );

  return (
    <>
      <div className="mx-auto text-black">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold mb-4 text-green-800">
            Accounts Manager
          </h2>
          <button
            onClick={() => {
              setForm({
                name: "",
                accountNumber: "",
                bankId: 0,
                currencyCode: "",
                categoryId: 0,
              });
              setEditingId(null);
              setModalOpen(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Add Account
          </button>
        </div>

        <div className="flex justify-end items-center mb-4">
          <input
            type="text"
            placeholder="Search by name or account number..."
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
                <th className="px-4 py-3 text-gray-700">S/N</th>
                <th className="px-4 py-3 text-gray-700">Name</th>
                <th className="px-4 py-3 text-gray-700">Account #</th>
                <th className="px-4 py-3 text-gray-700">Bank</th>
                <th className="px-4 py-3 text-gray-700">Currency</th>
                <th className="px-4 py-3 text-gray-700">Category</th>
                <th className="px-4 py-3 text-gray-700 w-[5%] text-center">
                  ⋮
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts?.map((acc, index) => (
                <tr key={acc.id} className="border-t hover:bg-green-100">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 capitalize">{acc.name}</td>
                  <td className="px-4 py-3">{acc.accountNumber}</td>
                  <td className="px-4 py-3 capitalize">{acc.bank.name}</td>
                  <td className="px-4 py-3">{acc.currency.code}</td>
                  <td className="px-4 py-3 capitalize">{acc.category.name}</td>
                  <td className="px-2 py-3 relative text-center">
                    <button
                      onClick={() => toggleDropdown(acc.id)}
                      className="text-xl font-bold hover:text-gray-700"
                    >
                      ⋮
                    </button>
                    {dropdownOpenId === acc.id && (
                      <div
                        ref={dropdownRef}
                        onMouseLeave={() => setDropdownOpenId(null)}
                        className="absolute right-2 mt-2 bg-white border border-green-800 rounded-lg shadow-lg z-20 w-32 transition-all"
                        style={{ transform: "translateY(4px)" }}
                      >
                        <button
                          onClick={() => handleEdit(acc)}
                          className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(acc.id);
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
              {filteredAccounts?.length === 0 && (
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


      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Account" : "Add New Account"}>
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
                Account name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="border text-black border-green-300 bg-green-50 px-3 py-2 rounded-md w-full focus:ring-2 focus:ring-green-500"
                placeholder="Account name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Account number
              </label>
              <input
                type="text"
                name="accountNumber"
                value={form.accountNumber}
                onChange={handleChange}
                className="border border-green-300 bg-green-50 px-3 py-2 rounded-md w-full focus:ring-2 focus:ring-green-500"
                placeholder="Account number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bank</label>
              <select
                name="bankId"
                value={form.bankId}
                onChange={handleChange}
                className="border border-green-300 bg-green-50 px-3 py-2 rounded-md w-full focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select bank</option>
                {banks?.map((bank) => (
                  <option key={bank.id} value={bank.id}>
                    {bank.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Currency Code
              </label>
              <select
                name="currencyCode"
                value={form.currencyCode}
                onChange={handleChange}
                className="border border-green-300 bg-green-50 px-3 py-2 rounded-md w-full focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select currency</option>
                {currencies?.map((c) => (
                  <option key={c.id} value={c.code}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="border border-green-300 bg-green-50 px-3 py-2 rounded-md w-full focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select category</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id} className="capitalize">
                    {cat.name}
                  </option>
                ))}
              </select>
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
