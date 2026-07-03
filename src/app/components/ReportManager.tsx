"use client";

import { useEffect, useState } from "react";
import { loadAccount } from "../lib/account";
import { formatAmount } from "./TransactionManager";
import LoadingScreen from "./LoadingScreen";
import toast from "react-hot-toast";
import { FaPrint, FaSearch, FaFilePdf } from "react-icons/fa";

interface Account {
  id: number;
  name: string;
  accountNumber: string;
  bank: {
    id: number;
    name: string;
  };
  currency: {
    id: number;
    code: string;
    name: string;
  };
  category: {
    id: number;
    name: string;
  };
  balance: string;
}

export default function ReportManager() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [reportDate, setReportDate] = useState("");

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await loadAccount();
      if (res.success) {
        setAccounts(res.data.data || []);
      } else {
        toast.error(res.message || "Failed to load accounts.");
      }
    } catch {
      toast.error("Failed to load accounts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
    setReportDate(new Date().toLocaleString());
  }, []);

  const handlePrint = () => {
    // Update report time to show the exact printing timestamp
    setReportDate(new Date().toLocaleString());
    // Trigger window.print
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const filteredAccounts = accounts.filter((acc) => {
    const term = search.toLowerCase();
    return (
      acc.name.toLowerCase().includes(term) ||
      acc.accountNumber.includes(term) ||
      acc.bank.name.toLowerCase().includes(term) ||
      acc.category.name.toLowerCase().includes(term)
    );
  });

  // Calculate currency totals
  const currencyTotals: Record<string, number> = {};
  filteredAccounts.forEach((acc) => {
    const code = acc.currency.code;
    const bal = Number(acc.balance) || 0;
    currencyTotals[code] = (currencyTotals[code] || 0) + bal;
  });

  // Calculate category & currency totals
  const categoryTotals: Record<string, Record<string, number>> = {};
  filteredAccounts.forEach((acc) => {
    const catName = acc.category?.name || "Uncategorized";
    const code = acc.currency.code;
    const bal = Number(acc.balance) || 0;

    if (!categoryTotals[catName]) {
      categoryTotals[catName] = {};
    }
    categoryTotals[catName][code] = (categoryTotals[catName][code] || 0) + bal;
  });

  return (
    <>
      <div className="mx-auto text-black print:text-black bg-white p-6 rounded-xl shadow border border-gray-100 print:shadow-none print:border-none print:p-0">
        
        {/* Printable Header Section */}
        <div className="hidden print:flex flex-col items-center mb-8 border-b pb-4">
          <h1 className="text-2xl font-bold text-green-800 tracking-wide">
            NIGERIA GOVERNORS' FORUM (NGF)
          </h1>
          <h2 className="text-lg font-semibold text-gray-700 uppercase tracking-widest mt-1">
            Fund Dashboard - Account Balances Report
          </h2>
          <p className="text-xs text-gray-500 mt-2">
            Generated on: {reportDate}
          </p>
        </div>

        {/* Screen Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 print:hidden">
          <div>
            <h2 className="text-xl font-bold text-green-800">Reports</h2>
            <p className="text-sm text-gray-500">
              Generate and export printable reports for all accounts.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row w-full md:w-auto items-center gap-3">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search report..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-green-300 bg-green-50 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
              />
              <span className="absolute left-3 top-3 text-green-600">
                <FaSearch size={14} />
              </span>
            </div>

            <button
              onClick={handlePrint}
              disabled={loading || accounts.length === 0}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <FaPrint /> Export as PDF
            </button>
          </div>
        </div>

        {/* Section 1: Individual Account Balances */}
        <div className="mb-8">
          <h3 className="text-base font-bold mb-3 text-green-800 border-b pb-1.5 uppercase print:text-sm">
            1. Individual Account Balances
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border border-gray-200 bg-white">
              <thead className="bg-green-50 print:bg-gray-100">
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700">S/N</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700">Account Name</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700">Account Number</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700">Bank Name</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700">Category</th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-700">Balance</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((acc, index) => (
                  <tr key={acc.id} className="border-b hover:bg-green-50/50 print:hover:bg-transparent">
                    <td className="px-4 py-2 text-sm text-gray-800">{index + 1}</td>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900 capitalize">{acc.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-600 font-mono">{acc.accountNumber}</td>
                    <td className="px-4 py-2 text-sm text-gray-700 capitalize">{acc.bank.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-700 capitalize">{acc.category?.name || "-"}</td>
                    <td className="px-4 py-2 text-sm font-semibold text-right text-gray-900">
                      {acc.currency.code} {formatAmount(acc.balance)}
                    </td>
                  </tr>
                ))}
                {filteredAccounts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-sm text-gray-500">
                      No matching accounts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Summary by Currency */}
        <div className="mb-8 print:break-inside-avoid">
          <h3 className="text-base font-bold mb-3 text-green-800 border-b pb-1.5 uppercase print:text-sm">
            2. Summary by Currency
          </h3>
          <div className="max-w-md">
            <table className="w-full table-auto border border-gray-200 bg-white">
              <thead className="bg-green-50 print:bg-gray-100">
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700">Currency</th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-700">Total Balance</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(currencyTotals).map(([code, total]) => (
                  <tr key={code} className="border-b">
                    <td className="px-4 py-2 text-sm font-medium text-gray-800">{code}</td>
                    <td className="px-4 py-2 text-sm font-bold text-right text-gray-900">
                      {code} {formatAmount(total)}
                    </td>
                  </tr>
                ))}
                {Object.keys(currencyTotals).length === 0 && (
                  <tr>
                    <td colSpan={2} className="text-center py-4 text-sm text-gray-500">
                      No currency summaries available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Summary by Category and Currency */}
        <div className="mb-6 print:break-inside-avoid">
          <h3 className="text-base font-bold mb-3 text-green-800 border-b pb-1.5 uppercase print:text-sm">
            3. Summary by Category
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(categoryTotals).map(([catName, totals]) => (
              <div key={catName} className="border border-gray-200 rounded-lg p-4 bg-white print:border print:p-3">
                <h4 className="text-sm font-bold text-gray-800 border-b pb-1 mb-2.5 uppercase tracking-wide">
                  {catName}
                </h4>
                <table className="w-full table-auto">
                  <tbody>
                    {Object.entries(totals).map(([code, total]) => (
                      <tr key={code} className="border-b last:border-0">
                        <td className="py-1.5 text-sm text-gray-600">{code}</td>
                        <td className="py-1.5 text-sm font-bold text-right text-gray-900">
                          {code} {formatAmount(total)}
                        </td>
                      </tr>
                    ))}
                    {Object.keys(totals).length === 0 && (
                      <tr>
                        <td colSpan={2} className="py-2 text-center text-xs text-gray-500">
                          No totals.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ))}
            {Object.keys(categoryTotals).length === 0 && (
              <div className="col-span-2 text-center py-4 text-sm text-gray-500 border rounded-lg">
                No category summaries available.
              </div>
            )}
          </div>
        </div>

        {/* Printable Footer Section */}
        <div className="hidden print:block text-center mt-12 pt-4 border-t border-gray-200 text-xs text-gray-400">
          Nigeria Governors' Forum (NGF) Fund Dashboard. This document is confidential and for internal use only.
        </div>

      </div>
      {loading && <LoadingScreen text="Loading report..." />}
    </>
  );
}
