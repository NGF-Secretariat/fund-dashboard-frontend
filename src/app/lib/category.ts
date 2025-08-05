import toast from "react-hot-toast";


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:4000';

export const loadACategory = async (): Promise<any> => {
    try {
        let token = '';
        if (typeof window !== 'undefined') {
            token = localStorage.getItem('token') || '';
        }

        const response = await fetch(`${BASE_URL}/categories`, {
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

export const createCategory = async (form: { name: string }): Promise<any> => {
    try {
        let token = '';
        if (typeof window !== 'undefined') {
            token = localStorage.getItem('token') || '';
        }

        const response = await fetch(`${BASE_URL}/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name: form.name }),
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
        toast.error('Oops create');
        return {
            success: false,
            message: 'Network error. Please try again.',
        };
    }
};
export const updateCategory = async (id: string | number, form: { name: string }): Promise<any> => {
    try {
        let token = '';
        if (typeof window !== 'undefined') {
            token = localStorage.getItem('token') || '';
        }

        const response = await fetch(`${BASE_URL}/categories/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name: form.name }),
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
        toast.error('Oops update');
        return {
            success: false,
            message: 'Network error. Please try again.',
        };
    }
};

export const deleteCategory = async (id: string | number): Promise<any> => {
    try {
        let token = '';
        if (typeof window !== 'undefined') {
            token = localStorage.getItem('token') || '';
        }

        const response = await fetch(`${BASE_URL}/categories/${id}`, {
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
