

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:4000';

export const loadAccount = async (categoryId: string): Promise<any> => {
    try {
        // Get token from localStorage
        let token = '';
        if (typeof window !== 'undefined') {
            token = localStorage.getItem('token') || '';
            
        }
        
        const response = await fetch(`${BASE_URL}/dashboard/grouped-accounts/${categoryId}`, {
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
