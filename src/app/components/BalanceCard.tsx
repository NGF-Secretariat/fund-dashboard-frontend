import React from "react";

interface BalanceCardProps {
  icon: React.ReactNode;
  amount: string | number;
  label: string;
  currency?: string; // e.g. 'naira', 'usd', 'gbp'
}

// Map your known currency codes to symbols
const currencySymbolMap: Record<string, string> = {
  ngn: "₦",
  usd: "$",
  gbp: "£",
};

const BalanceCard: React.FC<BalanceCardProps> = ({ icon, amount, label, currency }) => {

  const formattedAmount = new Intl.NumberFormat('en-US').format(Number(amount));

  const symbol = currency ? currencySymbolMap[currency.toLowerCase()] ?? "" : "₦";

  return (
    <div className="flex items-center gap-4 bg-myGreenDark text-white rounded-2xl px-5 py-4 w-fit shadow-md">
      {/* Icon */}
      <div className="bg-white/20 p-2 rounded-full">
        <div className="bg-white p-2 rounded-full text-orange-500 text-lg flex items-center justify-center">
          {icon}
        </div>
      </div>

      {/* Amount & Label */}
      <div className="space-y-1">
        <p className="text-base font-semibold">
          {symbol} {formattedAmount}
        </p>
        <p className="text-sm text-white/80">{label}</p>
      </div>
    </div>
  );
};

export default BalanceCard;
