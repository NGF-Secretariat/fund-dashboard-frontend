
export const checkLoggedIn = () => {
    const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    return JSON.parse(user || "{}");
};

export function formatAmount(amount: string | number) {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
    }).format(Number(amount));
}

export function formatAmountWithCurrency(
    amount: string | number,
    currency: string = "USD"
) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
    }).format(Number(amount));
}