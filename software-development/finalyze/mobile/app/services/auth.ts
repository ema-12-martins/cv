const API_BASE_URL = 'http://10.0.2.2:8080';

export interface User {
  id: number;
  email: string;
  name: string;
  birthdate: string;
  mobileNumber: number;
  amountSaved: number;
  authorities: Array<{ authority: string }>;
  lastLogin: string;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  enabled: boolean;
  passwordHash: string | null;
}

export interface RegisterData {
  name: string;
  email: string;
  mobileNumber: string;
  birthdate: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ApiResponse {
  message?: string;
  success?: boolean;
  user?: User;
}

// Helper function to handle API requests
async function apiRequest<T>(
  endpoint: string,
  method: string,
  body?: any
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    method,
    headers,
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  };

  try {
    const response = await fetch(url, config);
    console.log(response);

    if (response.status == 403) {
      throw new Error(
        'Forbidden: You do not have permission to access this resource'
      );
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          data.error ||
          `Request failed with status ${response.status}`
      );
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

export const authService = {
  // Register a new user
  async register(userData: RegisterData): Promise<ApiResponse> {
    const response = await apiRequest<ApiResponse>(
      '/api/auth/register',
      'POST',
      userData
    );

    if (response.success) {
      return response;
    } else {
      throw new Error(response.message || 'Registration failed');
    }
  },

  // Login
  async login(credentials: LoginData): Promise<User> {
    const response = await apiRequest<ApiResponse>(
      '/api/auth/login',
      'POST',
      credentials
    );

    // If the response contains a user object, return it
    // Otherwise, we need to fetch the user separately
    if (response.user) {
      return response.user;
    } else if (response.success) {
      // If we got a success message but no user, fetch the user
      return this.fetchCurrentUser();
    } else {
      throw new Error('Login failed: No user data returned');
    }
  },

  // Update user profile
  async updateProfile(updatedData: Partial<User>): Promise<User> {
    const response = await apiRequest<User>(
      '/api/user/update',
      'PUT',
      updatedData
    );
    return response;
  },

  // Delete user account
  async deleteAccount(): Promise<void> {
    await apiRequest<ApiResponse>('/api/user/delete', 'DELETE');
  },

  // Logout
  async logout(): Promise<void> {
    await apiRequest<ApiResponse>('/api/auth/logout', 'POST');
  },

  // Get current user from API
  async fetchCurrentUser(): Promise<User> {
    const response = await apiRequest<User>('/api/user/me', 'GET');
    return response;
  },

  // Helper to check if a user has a specific role
  hasRole(user: User | null, role: string): boolean {
    return user?.authorities?.some((auth) => auth.authority === role) || false;
  },
};
