'use client';

import { useEffect, useState } from "react";
import { FaChartBar, FaWallet, FaArrowDown, FaArrowUp, FaMoneyBillWave } from "react-icons/fa";
import { TabButton } from "../components/TabButton";
import { AccordionItem } from "../components/AccordionItem";
import { loadAccount } from "../lib/dashboard";
import LoadingScreen from "../components/LoadingScreen";
import BalanceCard from "../components/BalanceCard";

export default function DashboardHome() {
  const [activeTab, setActiveTab] = useState("secretariat");
  const [data, setData] = useState<any>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

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

  const handleTabA = () => {
    setActiveTab("secretariat");
  };

  const handleTabB = () => {
    setActiveTab("project");
  };

  const projectArray = data?.data?.project
    ? Object.entries(data.data.project).map(([bank, currencies]) => ({
        bank,
        currencies
      }))
    : [];

  const secretariatArray = data?.data?.secretariat
    ? Object.entries(data.data.secretariat).map(([bank, currencies]) => ({
        bank,
        currencies
      }))
    : [];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-textRed text-xl font-semibold">Fund Dashboard</h3>
      </div>

      <div className="flex space-x-4">
        <TabButton icon={<FaChartBar />} label="Secretariat" onClick={handleTabA} active={activeTab === "secretariat"} />
        <TabButton icon={<FaWallet />} label="Project" onClick={handleTabB} active={activeTab === "project"} />
      </div>

      {loading ? (
        <LoadingScreen  fullscreen={true} text="please wait..."/>
      ) : (
        <div className="py-5">
          {activeTab === "secretariat" && secretariatArray.length > 0 &&
            secretariatArray.map((item, idx) => (
              <AccordionItem
                key={item.bank}
                title={item.bank}
                isOpen={openIndex === idx}
                onToggle={() => toggleAccordion(idx)}
                content={
                  Object.entries(item.currencies as Record<string, unknown>).map(([currency, accounts]) =>
                    Array.isArray(accounts) ? (
                      <div key={currency} className="mb-6 border border-gray-200 rounded-md p-4 bg-gray-50">
                        <h4 className="font-semibold text-textRed mb-3 text-sm uppercase">{currency}</h4>

                        {accounts.map((account: any) => (
                          <div key={account.id} className="mb-5 space-y-2 border border-green-500 py-4 rounded">
                            <p className="text-sm text-gray-700 font-medium text-center">
                              <span className="font-bold">Bank:</span> {item.bank} &nbsp;|&nbsp;
                              <span className="font-bold">Account Name:</span> {account.name} &nbsp;|&nbsp;
                              <span className="font-bold">Account No:</span> {account.accountNumber}
                            </p>

                            <div className="flex flex-wrap gap-4 justify-around">
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
                              />
                              <BalanceCard
                                amount={account.outflow}
                                icon={<FaArrowUp />}
                                label="Outflow"
                                currency={currency}
                              />
                              <BalanceCard
                                amount={account.currentBalance}
                                icon={<FaMoneyBillWave />}
                                label="Cur Bal"
                                currency={currency}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null
                  )
                }
              />
            ))}

          {activeTab === "project" && projectArray.length > 0 &&
            projectArray.map((item, idx) => (
              <AccordionItem
                key={item.bank}
                title={item.bank}
                isOpen={openIndex === idx}
                onToggle={() => toggleAccordion(idx)}
                content={
                  Object.entries(item.currencies as Record<string, unknown>).map(([currency, accounts]) =>
                    Array.isArray(accounts) ? (
                      <div key={currency} className="mb-6 border border-gray-200 rounded-md shadow-lg p-4 bg-gray-50">
                        <h4 className="font-semibold text-textRed mb-3 text-sm uppercase">{currency}</h4>

                        {accounts.map((account: any) => (
                          <div key={account.id} className="mb-5 space-y-2 border border-green-500 py-4 rounded">
                            <p className="text-sm text-gray-700 font-medium text-center">
                              <span className="font-bold">Bank:</span> {item.bank} &nbsp;|&nbsp;
                              <span className="font-bold">Account Name:</span> {account.name} &nbsp;|&nbsp;
                              <span className="font-bold">Account No:</span> {account.accountNumber}
                            </p>

                            <div className="flex flex-wrap gap-4 justify-around ">
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
                              />
                              <BalanceCard
                                amount={account.outflow}
                                icon={<FaArrowUp />}
                                label="Outflow"
                                currency={currency}
                              />
                              <BalanceCard
                                amount={account.currentBalance}
                                icon={<FaMoneyBillWave />}
                                label="Cur Bal"
                                currency={currency}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null
                  )
                }
              />
            ))}
        </div>
      )}
    </div>
  );
}
