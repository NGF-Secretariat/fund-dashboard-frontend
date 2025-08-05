import toast from "react-hot-toast";


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:4000';

export const loadCurrency = async (): Promise<any> => {
    try {
        let token = '';
        if (typeof window !== 'undefined') {
            token = localStorage.getItem('token') || '';
        }

        const response = await fetch(`${BASE_URL}/currencies`, {
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
