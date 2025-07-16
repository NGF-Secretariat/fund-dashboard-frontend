

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:4000';

export const loadBank = async (): Promise<any> => {
    try {
        let token = '';
        if (typeof window !== 'undefined') {
            token = localStorage.getItem('token') || '';
        }
        
        const response = await fetch(`${BASE_URL}/banks`, {
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

export const createBank = async (editedName: string): Promise<any> => {
    try {
        let token = '';
        if (typeof window !== 'undefined') {
            token = localStorage.getItem('token') || '';
        }
        
        const response = await fetch(`${BASE_URL}/banks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({name: editedName}),
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
export const updateBank = async (id: string| number, editedName: string): Promise<any> => {
    try {
        let token = '';
        if (typeof window !== 'undefined') {
            token = localStorage.getItem('token') || '';
        }
        
        const response = await fetch(`${BASE_URL}/banks/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({name: editedName}),
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

export const deleteBank = async (id: string| number): Promise<any> => {
    try {
        let token = '';
        if (typeof window !== 'undefined') {
            token = localStorage.getItem('token') || '';
        }
        
        const response = await fetch(`${BASE_URL}/banks/${id}`, {
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
