

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:4000';

const getToken = (): string => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token') || '';
    }
    return '';
};
export const loadAccount = async (categoryId: string): Promise<any> => {
    try {
        // Get token from localStorage
        let token = getToken();
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

export const loadAccountSummary= async (accountId: string, startDate: string, endDate: string, type?: string): Promise<any> => {

    try {
        const token = getToken();
        const url = new URL(`${BASE_URL}/dashboard/account-summary`);
        url.searchParams.append('accountId', accountId.toString());
        url.searchParams.append('startDate', startDate);
        url.searchParams.append('endDate', endDate);
        if (type) url.searchParams.append('type', type);

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
