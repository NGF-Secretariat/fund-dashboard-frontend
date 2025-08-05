import React from "react";

interface BalanceCardProps {
  icon: React.ReactNode;
  amount: string | number;
  label: string;
  currency?: string;
}

const currencySymbolMap: Record<string, string> = {
  ngn: "₦",
  usd: "$",
  gbp: "£",
};

const BalanceCard: React.FC<BalanceCardProps> = ({ icon, amount, label, currency }) => {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount));

  const symbol = currency ? currencySymbolMap[currency.toLowerCase()] ?? "" : "₦";

  return (
    <div className="flex items-center gap-4 bg-gradient-to-br from-myGreenDark to-emerald-600 text-white rounded-2xl px-6 py-5 w-full sm:w-fit shadow-xl hover:scale-[1.02] transition-transform duration-300">
      {/* Icon Container */}
      <div className="bg-white/20 p-2 rounded-full shadow-inner">
        <div className="bg-white p-3 rounded-full text-orange-500 text-xl flex items-center justify-center">
          {icon}
        </div>
      </div>

      {/* Amount & Label */}
      <div className="space-y-1">
        <p className="text-lg font-bold tracking-wide leading-tight">
          {symbol} {formattedAmount}
        </p>
        <p className="text-sm text-white/80 font-medium">{label}</p>
      </div>
    </div>
  );
};

export default BalanceCard;
