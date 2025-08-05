// Token management utility
class TokenManager {
  private static instance: TokenManager;
  private refreshPromise: Promise<string> | null = null;

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  getAccessToken(): string | null {
    return localStorage.getItem("access_token");
  }

  getRefreshToken(): string | null {
    return localStorage.getItem("refresh_token");
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
  }

  clearTokens(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  async refreshAccessToken(): Promise<string> {
    // If there's already a refresh in progress, wait for it
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    // Check if refresh token is expired
    if (this.isTokenExpired(refreshToken)) {
      this.clearTokens();
      throw new Error("Refresh token expired");
    }

    this.refreshPromise = this.performRefresh(refreshToken);

    try {
      const newAccessToken = await this.refreshPromise;
      return newAccessToken;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performRefresh(refreshToken: string): Promise<string> {
    try {
      const response = await fetch("http://127.0.0.1:8000/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh_token: refreshToken
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();
      
      // Store new tokens
      this.setTokens(data.access_token, data.refresh_token);
      
      return data.access_token;
    } catch (error) {
      // If refresh fails, clear all tokens
      this.clearTokens();
      throw error;
    }
  }

  async getValidAccessToken(): Promise<string> {
    const accessToken = this.getAccessToken();
    
    if (!accessToken) {
      throw new Error("No access token available");
    }

    // If token is still valid, return it
    if (!this.isTokenExpired(accessToken)) {
      return accessToken;
    }

    // If token is expired, try to refresh
    return await this.refreshAccessToken();
  }
}

// Axios interceptor to automatically handle token refresh
export const setupAxiosInterceptors = (axios: any) => {
  const tokenManager = TokenManager.getInstance();

  // Request interceptor to add token
  axios.interceptors.request.use(
    async (config: any) => {
      try {
        const token = await tokenManager.getValidAccessToken();
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        // If we can't get a valid token, redirect to login
        window.location.href = '/login';
        return Promise.reject(error);
      }
      return config;
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle 401 errors
  axios.interceptors.response.use(
    (response: any) => response,
    async (error: any) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const newAccessToken = await tokenManager.refreshAccessToken();
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          tokenManager.clearTokens();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default TokenManager;
