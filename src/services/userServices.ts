import { Pagination } from "@/types/plant";
import { User, UserApi } from "@/types/user";
import { createClient } from "@/utils/supabase/client";

export function getUserProfile(): Promise<User> {
  const supabase = createClient();

  return supabase.functions
    .invoke("profile-data", {
      method: "GET",
    })
    .then(({ data, error }) => {
      if (error) throw error;

      return {
        id: data?.user_id || "",
        firstName: data?.first_name,
        lastName: data?.last_name,
        role: data?.role || "",
        email: data?.email,
        joinedAt: data?.created_at || "",
      };
    });
}

export function updateUserProfile({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}): Promise<User> {
  const supabase = createClient();

  return supabase.functions
    .invoke("profile-data", {
      method: "PUT",
      body: {
        first_name: firstName,
        last_name: lastName,
      },
    })
    .then(({ data }) => {
      return {
        id: data?.user_id || "",
        firstName: data?.first_name,
        lastName: data?.last_name,
        role: data?.role || "",
        email: data?.email,
        joinedAt: data?.created_at || "",
      };
    });
}

export function getUsers({
  search,
  page,
  limit,
}: {
  search: string;
  page: number;
  limit: number;
}): Promise<{
  data: User[];
  pagination: Pagination;
}> {
  let path = `user-data?page=${page}&limit=${limit}`;
  if (search) path += `&search=${search}`;

  const supabase = createClient();

  return supabase.functions
    .invoke(path, {
      method: "GET",
    })
    .then(({ data, error }) => {
      if (error) throw error;

      return {
        data: data.data.map((user: UserApi) => ({
          id: user.user_id,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          email: user.email,
          joinedAt: user.created_at,
        })),
        pagination: data.pagination,
      };
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

export function deleteUsers({ ids }: { ids: string[] }): Promise<User> {
  const supabase = createClient();

  return supabase.functions
    .invoke("user-data", {
      method: "DELETE",
      body: {
        ids,
      },
    })
    .then(async ({ data, response }) => {
      if (response?.ok === false) {
        const resp = await response?.json();
        throw resp.error;
      }

      return data;
    });
}
