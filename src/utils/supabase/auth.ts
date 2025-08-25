import { TokenStorage } from "./tokenStorage";
import { createClient } from "./client";
import { Session } from "@supabase/supabase-js";

const getSupabaseClient = () => createClient();

const extractRole = (session: Session | null): string => {
  return (
    session?.user?.app_metadata?.user_role ||
    session?.user?.user_metadata?.role ||
    "member"
  );
};

const extractOrganization = (session: Session | null): string | null => {
  return (
    session?.user?.app_metadata?.organization ||
    null
  );
};

const extractOrganizationId = (session: Session | null): string | null => {
  return (
    session?.user?.app_metadata?.organization_id ||
    null
  );
};

const handleTokenStorage = (session: Session): void => {
  if (!session) return;

  const { access_token, expires_at } = session;
  const userRole = extractRole(session);
  const organization = extractOrganization(session);
  const organizationId = extractOrganizationId(session);

  TokenStorage.setToken(access_token, expires_at, userRole, organization, organizationId);
};

export const getCurrentUserOrganization = async (): Promise<string | null> => {
  try {
    const organizationFromToken = TokenStorage.getOrganization();
    if (organizationFromToken) return organizationFromToken;

    const supabase = getSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select(`
        organization_id,
        organizations!inner(name)
      `)
      .eq("user_id", user.id)
      .single();

    return profile?.organizations?.[0]?.name || null;
  } catch {
    return null;
  }
};

export const getCurrentUserOrganizationId = async (): Promise<string | null> => {
  try {
    const organizationIdFromToken = TokenStorage.getOrganizationId();
    if (organizationIdFromToken) return organizationIdFromToken;

    const supabase = getSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("user_id", user.id)
      .single();

    return profile?.organization_id || null;
  } catch {
    return null;
  }
};

export const initializeAuth = () => {
  const supabase = getSupabaseClient();

  supabase.auth.onAuthStateChange((event, session) => {
    switch (event) {
      case "SIGNED_IN":
        if (session) {
          handleTokenStorage(session);
        }
        break;

      case "SIGNED_OUT":
        TokenStorage.clearToken();
        break;

      case "TOKEN_REFRESHED":
        if (session) {
          handleTokenStorage(session);
        }
        break;
    }
  });

  return supabase;
};

export const getCurrentUserRole = async (): Promise<string> => {
  try {
    const roleFromToken = TokenStorage.getUserRole();
    if (roleFromToken !== "member") return roleFromToken;

    const supabase = getSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return "member";

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    return profile?.role || "member";
  } catch {
    return "member";
  }
};

export const refreshUserRole = async (): Promise<string> => {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.refreshSession();
  if (error) {
    console.error("Failed to refresh session:", error);
    return TokenStorage.getUserRole();
  }

  return getCurrentUserRole();
};

export const refreshUserOrganization = async (): Promise<string | null> => {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.refreshSession();
  if (error) {
    console.error("Failed to refresh session:", error);
    return TokenStorage.getOrganization();
  }

  return getCurrentUserOrganization();
};

export const getCurrentUserInfo = async () => {
  const [role, organization, organizationId] = await Promise.all([
    getCurrentUserRole(),
    getCurrentUserOrganization(),
    getCurrentUserOrganizationId()
  ]);

  return {
    role,
    organization,
    organizationId
  };
};

export { getSupabaseClient as createClient };
