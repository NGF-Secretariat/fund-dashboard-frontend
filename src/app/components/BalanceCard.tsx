import React from "react";

interface BalanceCardProps {
  icon: React.ReactNode;
  amount: string | number;
  label: string;
  currency?: string;
  onClick?: () => void;
  month?: string;
  className?: string; // Added className prop
}

const currencySymbolMap: Record<string, string> = {
  ngn: "₦",
  usd: "$",
  gbp: "£",
};

const BalanceCard: React.FC<BalanceCardProps> = ({
  icon,
  amount,
  label,
  currency,
  onClick,
  month,
  className = "", // Default to empty string
}) => {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount));

  const symbol = currency
    ? currencySymbolMap[currency.toLowerCase()] ?? ""
    : "₦";

  // Determine if the amount is particularly long for font scaling
  const amountStr = `${symbol} ${formattedAmount}`;
  const isExtraLong = amountStr.length > 18;
  const isLong = amountStr.length > 12;

  return (
    <div
      className={`cursor-pointer flex items-center gap-3 bg-gradient-to-br from-myGreenDark to-emerald-600 text-white rounded-2xl px-6 py-5 shadow-xl hover:scale-[1.02] transition-all duration-300 border border-white/10 ${className}`}
      onClick={onClick}
      role="button"
    >
      {/* Icon Container */}
      <div className="bg-white/20 p-2 rounded-full shadow-inner flex-shrink-0">
        <div className="bg-white p-3 rounded-full text-orange-500 text-xl flex items-center justify-center">
          {icon}
        </div>
      </div>

      {/* Amount & Label */}
      <div className="space-y-0.5 overflow-hidden">
        <p
          className={`font-bold italic tracking-tight whitespace-nowrap overflow-hidden text-ellipsis px-2 ${isExtraLong ? "text-lg" : isLong ? "text-xl" : "text-2xl"
            }`}
          title={amountStr}
        >
          {amountStr}
        </p>
        <p className="text-xs uppercase tracking-wider text-white/70 font-semibold">{label}</p>
        {month && <span className="text-[10px] italic text-white/50 block">{month}</span>}
      </div>
    </div>
  );
};

export default BalanceCard;
