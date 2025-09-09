const KEYS = {
  TOKEN: "access_token",
  EXPIRES: "token_expires_at",
  ROLE: "user_role",
  ORGANIZATION: "organization",
  ORGANIZATION_ID: "organization_id",
} as const;

interface JwtAppMetadata {
  user_role?: string;
  organization?: string;
  organization_id?: string;
}

interface JwtPayload {
  app_metadata?: JwtAppMetadata;
  role: string;
  organization?: string;
  organization_id?: string;
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
    userRole?: string,
    organization?: string | null,
    organizationId?: string | null
  ): void {
    safeStorage.set(KEYS.TOKEN, accessToken);

    if (expiresAt) {
      safeStorage.set(KEYS.EXPIRES, expiresAt.toString());
    }

    // Extract role and organization from JWT
    const decoded = decodeJWT(accessToken);
    const jwtRole = decoded?.role;
    const appMetadataRole = decoded?.app_metadata?.user_role;

    const jwtOrganization = decoded?.organization;
    const appMetadataOrganization = decoded?.app_metadata?.organization;
    const jwtOrganizationId = decoded?.organization_id;
    const appMetadataOrganizationId = decoded?.app_metadata?.organization_id;

    const finalRole =
      jwtRole && jwtRole !== "authenticated"
        ? jwtRole
        : appMetadataRole || userRole || "member";

    safeStorage.set(KEYS.ROLE, finalRole);

    const finalOrganization = jwtOrganization || appMetadataOrganization;
    const finalOrganizationId = jwtOrganizationId || appMetadataOrganizationId;

    if (finalOrganization) {
      safeStorage.set(KEYS.ORGANIZATION, finalOrganization);
    } else {
      safeStorage.remove(KEYS.ORGANIZATION);
    }

    if (finalOrganizationId) {
      safeStorage.set(KEYS.ORGANIZATION_ID, finalOrganizationId);
    } else {
      safeStorage.remove(KEYS.ORGANIZATION_ID);
    }
  }

  static getToken(): string | null {
    return safeStorage.get(KEYS.TOKEN);
  }

  static getOrganization(): string | null {
    const token = this.getToken();
    if (token) {
      const decoded = decodeJWT(token);
      const jwtOrganization = decoded?.organization;
      const appMetadataOrganization = decoded?.app_metadata?.organization;

      if (jwtOrganization) return jwtOrganization;
      if (appMetadataOrganization) return appMetadataOrganization;
    }

    return safeStorage.get(KEYS.ORGANIZATION);
  }

  static getOrganizationId(): string | null {
    const token = this.getToken();
    if (token) {
      const decoded = decodeJWT(token);
      const jwtOrganizationId = decoded?.organization_id;
      const appMetadataOrganizationId = decoded?.app_metadata?.organization_id;

      if (jwtOrganizationId) return jwtOrganizationId;
      if (appMetadataOrganizationId) return appMetadataOrganizationId;
    }

    return safeStorage.get(KEYS.ORGANIZATION_ID);
  }

  static getAllUserData() {
    return {
      token: this.getToken(),
      role: this.getUserRole(),
      organization: this.getOrganization(),
      organizationId: this.getOrganizationId(),
      isExpired: this.isTokenExpired(),
    };
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
    const organization = this.getOrganization();
    const organizationId = this.getOrganizationId();
    const isExpired = this.isTokenExpired();

    return {
      token,
      role,
      organization,
      organizationId,
      isExpired,
      isAuthenticated: !isExpired && !!token,
      isAdmin: role === "super_admin" || role === "admin",
      isExpert: role === "expert",
      isMember: role === "member",
    };
  }

  static refreshRoleFromToken(): {
    role: string;
    organization: string | null;
    organizationId: string | null;
  } {
    const token = this.getToken();
    if (token) {
      const decoded = decodeJWT(token);
      const jwtRole = decoded?.role;
      const appMetadataRole = decoded?.app_metadata?.user_role;

      const jwtOrganization = decoded?.organization;
      const appMetadataOrganization = decoded?.app_metadata?.organization;
      const jwtOrganizationId = decoded?.organization_id;
      const appMetadataOrganizationId = decoded?.app_metadata?.organization_id;

      const finalRole =
        jwtRole && jwtRole !== "authenticated"
          ? jwtRole
          : appMetadataRole || "member";

      const finalOrganization =
        jwtOrganization || appMetadataOrganization || null;
      const finalOrganizationId =
        jwtOrganizationId || appMetadataOrganizationId || null;

      safeStorage.set(KEYS.ROLE, finalRole);

      if (finalOrganization) {
        safeStorage.set(KEYS.ORGANIZATION, finalOrganization);
      } else {
        safeStorage.remove(KEYS.ORGANIZATION);
      }

      if (finalOrganizationId) {
        safeStorage.set(KEYS.ORGANIZATION_ID, finalOrganizationId);
      } else {
        safeStorage.remove(KEYS.ORGANIZATION_ID);
      }

      return {
        role: finalRole,
        organization: finalOrganization,
        organizationId: finalOrganizationId,
      };
    }
    return { role: "member", organization: null, organizationId: null };
  }
}

export const useAuth = () => {
  const tokenInfo = TokenStorage.getTokenInfo();

  return {
    ...tokenInfo,
    logout: TokenStorage.clearToken,
    refreshRole: () => {
      safeStorage.remove(KEYS.ROLE);
      safeStorage.remove(KEYS.ORGANIZATION);
      safeStorage.remove(KEYS.ORGANIZATION_ID);
      return TokenStorage.getUserRole();
    },
    forceRefreshRole: () => {
      return TokenStorage.refreshRoleFromToken();
    },
    getOrganization: () => TokenStorage.getOrganization(),
    getOrganizationId: () => TokenStorage.getOrganizationId(),
    getAllUserData: () => TokenStorage.getAllUserData(),
  };
};
