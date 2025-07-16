
interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  message?: string;
}
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:4000';

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
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

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || 'Login failed',
      };
    }

    return {
      success: true,
      token: data.access_token,
      user: data.user,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Network error. Please try again.',
    };
  }
};
