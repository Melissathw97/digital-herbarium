const KEYS = {
  TOKEN: "access_token",
  EXPIRES: "token_expires_at",
  ROLE: "user_role",
} as const;

interface JwtAppMetadata {
  user_role?: string; // Define the user_role property
  // Add other app_metadata properties if they exist
}

interface JwtPayload {
  app_metadata?: JwtAppMetadata;
  role: string;
}

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
  },
};

const decodeJWT = (token: string): JwtPayload | null => {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

export class TokenStorage {
  static setToken(
    accessToken: string,
    expiresAt?: number,
    userRole?: string
  ): void {
    safeStorage.set(KEYS.TOKEN, accessToken);

    if (expiresAt) {
      safeStorage.set(KEYS.EXPIRES, expiresAt.toString());
    }

    // Extract role from JWT instead of relying on passed userRole
    const decoded = decodeJWT(accessToken);
    const jwtRole = decoded?.role;
    const appMetadataRole = decoded?.app_metadata?.user_role;

    // Use JWT role first, then app_metadata role, then fallback to passed userRole
    const finalRole =
      jwtRole && jwtRole !== "authenticated"
        ? jwtRole
        : appMetadataRole || userRole || "member";

    safeStorage.set(KEYS.ROLE, finalRole);
  }

  static getToken(): string | null {
    return safeStorage.get(KEYS.TOKEN);
  }

  static getUserRole(): string {
    const token = this.getToken();
    if (token) {
      const decoded = decodeJWT(token);
      const jwtRole = decoded?.role;
      const appMetadataRole = decoded?.app_metadata?.user_role;

      // Return JWT role if it's not the default 'authenticated'
      if (jwtRole && jwtRole !== "authenticated") {
        return jwtRole;
      }

      if (appMetadataRole) {
        return appMetadataRole;
      }
    }

    // Fallback to stored role only if JWT doesn't have a valid role
    const storedRole = safeStorage.get(KEYS.ROLE);
    if (storedRole) return storedRole;

    return "member";
  }

  static isTokenExpired(): boolean {
    const expiresAt = safeStorage.get(KEYS.EXPIRES);
    return !expiresAt || Date.now() > parseInt(expiresAt) * 1000;
  }

  static clearToken(): void {
    Object.values(KEYS).forEach((key) => safeStorage.remove(key));
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
      isSuperAdmin: role === "super_admin",
      isMember: role === "member",
    };
  }

  static refreshRoleFromToken(): string {
    const token = this.getToken();
    if (token) {
      const decoded = decodeJWT(token);
      const jwtRole = decoded?.role;
      const appMetadataRole = decoded?.app_metadata?.user_role;

      const finalRole =
        jwtRole && jwtRole !== "authenticated"
          ? jwtRole
          : appMetadataRole || "member";

      safeStorage.set(KEYS.ROLE, finalRole);
      return finalRole;
    }
    return "member";
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
    },
    forceRefreshRole: () => {
      return TokenStorage.refreshRoleFromToken();
    },
  };
};
