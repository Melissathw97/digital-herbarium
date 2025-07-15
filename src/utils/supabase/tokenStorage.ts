const KEYS = {
  TOKEN: 'access_token',
  EXPIRES: 'token_expires_at',
  ROLE: 'user_role'
} as const;

const safeStorage = {
  get: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  
  set: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Failed to store ${key}:`, error);
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove ${key}:`, error);
    }
  }
};

const decodeJWT = (token: string): Record<string, any> | null => {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

export class TokenStorage {
  static setToken(accessToken: string, expiresAt?: number, userRole?: string): void {
    safeStorage.set(KEYS.TOKEN, accessToken);
    
    if (expiresAt) {
      safeStorage.set(KEYS.EXPIRES, expiresAt.toString());
    }
    
    if (userRole) {
      safeStorage.set(KEYS.ROLE, userRole);
    }
  }

  static getToken(): string | null {
    return safeStorage.get(KEYS.TOKEN);
  }

  static getUserRole(): string {
    const storedRole = safeStorage.get(KEYS.ROLE);
    if (storedRole) return storedRole;
    
    const token = this.getToken();
    if (token) {
      const decoded = decodeJWT(token);
      return decoded?.role || 'member';
    }
    
    return 'member';
  }

  static isTokenExpired(): boolean {
    const expiresAt = safeStorage.get(KEYS.EXPIRES);
    return !expiresAt || Date.now() > parseInt(expiresAt) * 1000;
  }

  static clearToken(): void {
    Object.values(KEYS).forEach(key => safeStorage.remove(key));
  }

  static getTokenInfo() {
    const token = this.getToken();
    const role = this.getUserRole();
    const isExpired = this.isTokenExpired();
    
    return {
      token,
      role,
      isExpired,
      isAuthenticated: !isExpired && !!token,
      isSuperAdmin: role === 'super_admin',
      isMember: role === 'member'
    };
  }
}

export const useAuth = () => {
  const tokenInfo = TokenStorage.getTokenInfo();
  
  return {
    ...tokenInfo,
    logout: TokenStorage.clearToken,
    refreshRole: () => {
      safeStorage.remove(KEYS.ROLE);
      return TokenStorage.getUserRole();
    }
  };
};