import toast from "react-hot-toast";


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:4000';

interface LoadAuditParams {
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    user?: number;
}

export const loadAudit = async (params: LoadAuditParams = {}): Promise<any> => {
    try {
        let token = '';
        if (typeof window !== 'undefined') {
            token = localStorage.getItem('token') || '';
        }

        const query = new URLSearchParams();
        if (params.startDate) query.append('startDate', params.startDate);
        if (params.endDate) query.append('endDate', params.endDate);
        if (params.page !== undefined) query.append('page', String(params.page));
        if (params.limit !== undefined) query.append('limit', String(params.limit));

        const response = await fetch(`${BASE_URL}/audit-logs?${query.toString()}`, {
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

export const createCurrency = async (form: { code: string, name: string }): Promise<any> => {
    try {
        let token = '';
        if (typeof window !== 'undefined') {
            token = localStorage.getItem('token') || '';
        }

        const response = await fetch(`${BASE_URL}/currencies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ code: form.code, name: form.name }),
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
export const updateCurrency = async (id: string | number, form: { code: string, name: string }): Promise<any> => {
    try {
        let token = '';
        if (typeof window !== 'undefined') {
            token = localStorage.getItem('token') || '';
        }

        const response = await fetch(`${BASE_URL}/currencies/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ code: form.code, name: form.name }),
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

export const deleteCurrency = async (id: string | number): Promise<any> => {
    try {
        let token = '';
        if (typeof window !== 'undefined') {
            token = localStorage.getItem('token') || '';
        }

        const response = await fetch(`${BASE_URL}/currencies/${id}`, {
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
