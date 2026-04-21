import toast from "react-hot-toast";


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:4000';

const getToken = (): string => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token') || '';
    }
    return '';
};

export const loadTransaction = async (params: { page?: number; limit?: number; search?: string } = {}): Promise<any> => {
    try {
        const token = getToken();
        const query = new URLSearchParams();
        if (params.page !== undefined) query.append('page', String(params.page));
        if (params.limit !== undefined) query.append('limit', String(params.limit));
        if (params.search) query.append('search', params.search);

        const response = await fetch(`${BASE_URL}/transactions?${query.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            return {
                success: false,
                message: 'Invalid server response. Please try again.',
            };
        }

        if (!response) {
            return {
                success: false,
                message: data?.message || 'failed',
            };
        }

        return {
            success: true,
            data,
        };
    } catch (error) {
        return {
            success: false,
            message: 'Network error. Please try again.',
        };
    }
};

export const loadTransactionCondition = async (startDate: string, endDate: string, type?: string, page?: number, limit?: number): Promise<any> => {

    try {
        const token = getToken();
        const url = new URL(`${BASE_URL}/transactions`);
        url.searchParams.append('startDate', startDate);
        url.searchParams.append('endDate', endDate);
        if (type) url.searchParams.append('type', type);
        if (page !== undefined) url.searchParams.append('page', String(page));
        if (limit !== undefined) url.searchParams.append('limit', String(limit));

        const response = await fetch(url.toString(), {

            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            return {
                success: false,
                message: 'Invalid server response. Please try again.',
            };
        }

        if (!response) {
            return {
                success: false,
                message: data?.message || 'failed',
            };
        }

        return {
            success: true,
            data,
        };
    } catch (error) {
        return {
            success: false,
            message: 'Network error. Please try again.',
        };
    }
};

export const createTransaction = async (form: { accountId: number, type: string, amount: number, description: string }): Promise<any> => {
    try {
        const token = getToken();
        const response = await fetch(`${BASE_URL}/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ accountId: form.accountId, type: form.type, amount: form.amount, description: form.description }),
        });

        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            return {
                success: false,
                message: 'Invalid server response. Please try again.',
            };
        }

        if (!response) {
            return {
                success: false,
                message: data?.message || 'failed',
            };
        }

        return {
            success: true,
            data,
        };
    } catch (error) {
        return {
            success: false,
            message: 'Network error. Please try again.',
        };
    }
};
export const updateTransaction = async (id: string | number, form: { accountId: number, type: string, amount: number, description: string }): Promise<any> => {
    try {
        const token = getToken();

        const response = await fetch(`${BASE_URL}/transactions/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ accountId: form.accountId, type: form.type, amount: form.amount, description: form.description }),
        });

        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            toast.error('Oops');
            return {
                success: false,
                message: 'Invalid server response. Please try again.',
            };
        }

        if (!response) {
            return {
                success: false,
                message: data?.message || 'failed',
            };
        }

        return {
            success: true,
            data,
        };
    } catch (error) {
        return {
            success: false,
            message: 'Network error. Please try again.',
        };
    }
};

export const deleteTransaction = async (id: string | number): Promise<any> => {
    try {
        const token = getToken();

        const response = await fetch(`${BASE_URL}/transactions/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            return {
                success: false,
                message: 'Invalid server response. Please try again.',
            };
        }

        if (!response) {
            return {
                success: false,
                message: data?.message || 'failed',
            };
        }

        return {
            success: true,
            data,
        };
    } catch (error) {
        return {
            success: false,
            message: 'Network error. Please try again.',
        };
    }
};
