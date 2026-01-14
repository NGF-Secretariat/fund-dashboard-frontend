"use client";

import { useEffect, useState } from "react";
import {
  FaChartBar,
  FaWallet,
  FaArrowDown,
  FaArrowUp,
  FaMoneyBillWave,
} from "react-icons/fa";
import { TabButton } from "../components/TabButton";
import { AccordionItem } from "../components/AccordionItem";
import { loadAccount, loadAccountSummary } from "../lib/dashboard";
import LoadingScreen from "../components/LoadingScreen";
import BalanceCard from "../components/BalanceCard";
import Modal from "../components/Modal";
import toast from "react-hot-toast";
import { formatAmount, formatAmountWithCurrency } from "../lib/util";

export default function DashboardHome() {
  const [activeTab, setActiveTab] = useState("secretariat");
  const [data, setData] = useState<any>(null);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const res = await loadAccount(activeTab);
      setData(res);
      setLoading(false);
    }
    fetchData();
  }, [activeTab]);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleTabChange = (tab: string) => setActiveTab(tab);

  const getAccountArray = (type: "secretariat" | "project") => {
    return data?.data?.[type]
      ? Object.entries(data.data[type])
          .map(([bank, currencies]) => ({ bank, currencies }))
          .sort((a, b) => a.bank.localeCompare(b.bank)) // ✅ alphabetical
      : [];
  };

  const getStartAndEndOfMonth = () => {
    const now = new Date();
    const startDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    ).toISOString();
    const endDate = new Date().toISOString();
    // now.getFullYear(),
    // now.getMonth() + 1,
    // 0

    return { startDate, endDate };
  };

  const handleCardClick = async (account: any, action: string) => {
    // setModalContent(`Details for ${account.name}, action: ${action}`);
    setOpenModal(true);
    try {
      setLoading(true);
      const { startDate, endDate } = getStartAndEndOfMonth();

      const response = await loadAccountSummary(
        account.id.toString(),
        startDate.toString(),
        endDate.toString(),
        action
      );
      setSummaryData(response.data);
      // console.log(response.data);
    } catch (error) {
      toast.error("Failed to load transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderAccordionItems = (accountArray: any[]) =>
    accountArray.map((item, idx) => (
      <AccordionItem
        key={item.bank}
        title={item.bank}
        isOpen={openIndex === idx}
        onToggle={() => toggleAccordion(idx)}
        content={Object.entries(item.currencies as Record<string, unknown>).map(
          ([currency, accounts]) =>
            Array.isArray(accounts) ? (
              <div
                key={currency}
                className="mb-6 border border-gray-200 rounded-xl p-5 bg-white shadow-md transition-transform hover:shadow-lg"
              >
                <h4 className="font-semibold text-textRed mb-3 text-sm uppercase tracking-wider">
                  {currency}
                </h4>
                {[...accounts]
                  .sort((a: any, b: any) => a.name.localeCompare(b.name))
                  .map((account: any) => (
                    <div
                      key={account.id}
                      className="mb-5 space-y-3 border border-emerald-300 py-5 rounded-lg px-2 md:px-4 bg-emerald-50"
                    >
                      <p className="text-sm text-gray-800 font-medium text-center">
                        <span className="font-semibold">Bank:</span> {item.bank}{" "}
                        &nbsp;|&nbsp;
                        <span className="font-semibold">Name:</span>{" "}
                        {account.name} &nbsp;|&nbsp;
                        <span className="font-semibold">No:</span>{" "}
                        {account.accountNumber}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-5">
                        <BalanceCard
                          amount={account.previousBalance}
                          icon={<FaMoneyBillWave />}
                          label="Prev Bal"
                          currency={currency}
                        />

                        <BalanceCard
                          amount={account.inflow}
                          icon={<FaArrowDown />}
                          label="Inflow"
                          currency={currency}
                          onClick={() => handleCardClick(account, "inflow")}
                          month={new Date().toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          })}
                        />
                        <BalanceCard
                          amount={account.outflow}
                          icon={<FaArrowUp />}
                          label="Outflow"
                          currency={currency}
                          onClick={() => handleCardClick(account, "outflow")}
                          month={new Date().toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          })}
                        />
                        <BalanceCard
                          amount={account.currentBalance}
                          icon={<FaMoneyBillWave />}
                          label="Cur Bal"
                          currency={currency}
                          month={new Date().toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          })}
                        />
                      </div>
                    </div>
                  ))}
                <Modal
                  isOpen={openModal}
                  onClose={() => setOpenModal(false)}
                  title="Account Summary"
                  children={
                    <>
                      {loading ? (
                        <h4 className="italic text-green-500">Please wait...</h4>
                      ) : (
                        summaryData && (
                          <div className="space-y-4">
                            {/* Date Range */}
                            <h4 className="text-md font-semibold">
                              Date:
                              <span className="ml-2 font-normal">
                                {new Date(
                                  summaryData?.period?.startDate
                                ).toLocaleDateString()}{" "}
                                –{" "}
                                {new Date(
                                  summaryData?.period?.endDate
                                ).toLocaleDateString()}
                              </span>
                            </h4>

                            {/* Account Info */}
                            <h4 className="text-md font-semibold">
                              Transaction Summary:
                              <span className="ml-2 font-normal">
                                {summaryData?.account?.bank} |{" "}
                                {summaryData?.account?.accountNumber} |{" "}
                                {summaryData?.account?.currency}
                              </span>
                            </h4>

                            {/* Summary List */}
                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                              <li>
                                <span className="font-medium">
                                  Total Inflow:
                                </span>{" "}
                                {formatAmountWithCurrency(
                                  summaryData?.summary?.inflow,
                                  summaryData?.account?.currency
                                )}
                              </li>
                              <li>
                                <span className="font-medium">
                                  Total Outflow:
                                </span>{" "}
                                {formatAmountWithCurrency(
                                  summaryData?.summary?.outflow,
                                  summaryData?.account?.currency
                                )}
                              </li>
                              <li>
                                <span className="font-medium">
                                  Current Balance:
                                </span>{" "}
                                {formatAmountWithCurrency(
                                  summaryData?.summary?.currentBalance,
                                  summaryData?.account?.currency
                                )}
                              </li>
                              <li>
                                <span className="font-medium">
                                  Transaction Count:
                                </span>{" "}
                                {formatAmount(
                                  summaryData?.summary?.transactionCount
                                )}
                              </li>
                            </ul>
                          </div>
                        )
                      )}
                    </>
                  }
                />
              </div>
            ) : null
        )}
      />
    ));

  const tabs = [
    { label: "Secretariat", value: "secretariat", icon: <FaChartBar /> },
    { label: "Project", value: "project", icon: <FaWallet /> },
  ];

  return (
    <div className="p-2 sm:p-4 space-y-8">
      <div>
        <h3 className="text-2xl sm:text-3xl font-bold text-textRed mb-1">
          Fund Dashboard
        </h3>
        <p className="text-gray-600 text-sm">
          Track balances, inflows, and outflows.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <TabButton
            key={tab.value}
            icon={tab.icon}
            label={tab.label}
            onClick={() => handleTabChange(tab.value)}
            active={activeTab === tab.value}
          />
        ))}
      </div>

      {loading && <LoadingScreen fullscreen={true} text="Loading data..." />}
      <div className="py-2 space-y-2">
        {renderAccordionItems(getAccountArray(activeTab as any))}
      </div>
    </div>
  );
}
