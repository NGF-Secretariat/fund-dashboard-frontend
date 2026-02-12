const useUtilityHook = () => {

    const formatAmount = (amount: string | number) => {
        return new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(Number(amount));
    };
    return { formatAmount };
}
