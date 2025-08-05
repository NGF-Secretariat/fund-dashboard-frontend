export const checkLoggedIn = () => {
    const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    return JSON.parse(user || "{}");
};