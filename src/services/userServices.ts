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

export function updateUserRole({
  userId,
  role,
}: {
  userId: string;
  role: string;
}): Promise<User> {
  const supabase = createClient();

  return supabase.functions
    .invoke(`user-data/?user_id=${userId}`, {
      method: "PUT",
      body: {
        role,
      },
    })
    .then(async ({ data, response }) => {
      if (response?.ok === false) {
        const resp = await response?.json();
        throw resp.error;
      }

      return {
        id: data.data.user_id,
        firstName: data.data.first_name,
        lastName: data.data.last_name,
        role: data.data.role,
        email: data.data.email,
        joinedAt: data.data.created_at,
      };
    });
}

export function deleteUser({ userId }: { userId: string }): Promise<User> {
  const supabase = createClient();

  return supabase.functions
    .invoke(`user-data/?user_id=${userId}`, {
      method: "DELETE",
    })
    .then(async ({ data, response }) => {
      if (response?.ok === false) {
        const resp = await response?.json();
        throw resp.error;
      }

      return data;
    });
}
