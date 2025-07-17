import { TokenStorage } from './tokenStorage';
import { createClient } from './client'; 
const getSupabaseClient = () => createClient();

const extractRole = (session: any): string => {
  return session?.user?.app_metadata?.user_role || 
         session?.user?.user_metadata?.role || 
         'member';
};

const handleTokenStorage = (session: any): void => {
  if (!session) return;
  
  const { access_token, expires_at } = session;
  const userRole = extractRole(session);
  
  TokenStorage.setToken(access_token, expires_at, userRole);
};

export const initializeAuth = () => {
  const supabase = getSupabaseClient();
  
  supabase.auth.onAuthStateChange((event, session) => {    
    switch (event) {
      case 'SIGNED_IN':
        if (session) {
          handleTokenStorage(session);
        }
        break;
        
      case 'SIGNED_OUT':
        TokenStorage.clearToken();
        break;
        
      case 'TOKEN_REFRESHED':
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
    if (roleFromToken !== 'member') return roleFromToken;
    
    const supabase = getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 'member';
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();
    
    return profile?.role || 'member';
  } catch {
    return 'member';
  }
};

export const refreshUserRole = async (): Promise<string> => {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.refreshSession();
  if (error) {
    console.error('Failed to refresh session:', error);
    return TokenStorage.getUserRole();
  }
  
  return getCurrentUserRole();
};

export { getSupabaseClient as createClient };