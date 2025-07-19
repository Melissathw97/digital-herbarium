import { User, UserApi } from "@/types/user";
import { createClient } from "@/utils/supabase/client";

export function getUsers(): Promise<User[]> {
  const supabase = createClient();
  return supabase.functions
    .invoke("user-data", {
      method: "GET",
    })
    .then(({ data, error }) => {
      if (error) throw error;

      return data.map((user: UserApi) => ({
        id: user.user_id,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        email: user.email,
        joinedAt: user.created_at,
      }));
    });
}
