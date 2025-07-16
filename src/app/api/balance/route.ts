import { NextResponse } from "next/server";

export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function GET() {
  // Example data, you can replace this with a database call or external API
  const balanceData = {
    amount: 5000,
    label: "Account Balance",
  };

  return NextResponse.json(balanceData);
} 