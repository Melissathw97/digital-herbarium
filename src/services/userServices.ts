import { Pagination } from "@/types/plant";
import {
  Log,
  LogApi,
  LogItemApi,
  User,
  UserActivitySummary,
  UserApi,
} from "@/types/user";
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
        profileId: data?.id || "",
        firstName: data?.first_name,
        lastName: data?.last_name,
        expertise: data?.expertise || "",
        yearsOfExperience: data?.year_of_experience || "",
        role: data?.role || "",
        email: data?.email,
        organizations: {
          ...data?.organizations,
          colourCode: data?.organizations.colour_code,
        },
        joinedAt: data?.created_at || "",
      };
    });
}

export function updateUserProfile({
  firstName,
  lastName,
  expertise,
  yearsOfExperience,
}: {
  firstName: string;
  lastName: string;
  expertise: string;
  yearsOfExperience: string;
}): Promise<User> {
  const supabase = createClient();

  return supabase.functions
    .invoke("profile-data", {
      method: "PUT",
      body: {
        first_name: firstName,
        last_name: lastName,
        expertise,
        year_of_experience: Number(yearsOfExperience),
      },
    })
    .then(({ data }) => {
      return {
        id: data?.data.user_id || "",           
        profileId: data?.data.profile_id || "",
        firstName: data?.data.first_name,
        lastName: data?.data.last_name,
        expertise: data?.data.expertise,
        yearsOfExperience: data?.data.year_of_experience,
        role: data?.data.role || "",
        email: data?.data.email,
        joinedAt: data?.data.created_at || "",
      };
    });
}

export function getUsers({
  search,
  role,
  page,
  limit,
}: {
  search: string;
  role: string;
  page: number;
  limit: number;
}): Promise<{
  data: User[];
  pagination: Pagination;
}> {
  let path = `user-data?page=${page}&limit=${limit}`;
  if (search) path += `&search=${search}`;
  if (role && role !== "all") path += `&role=${role}`;

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
          profileId: user.profile_id,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          email: user.email,
          organization: {
            id: user.organization?.id,
            nid: user.organization?.nid,
            name: user.organization?.name,
            colourCode: user.organization?.color_code,
          },
          joinedAt: user.created_at,
        })),
        pagination: data.pagination,
      };
    });
}

export function getUserById({ id }: { id: string }): Promise<User> {
  const supabase = createClient();

  return supabase.functions
    .invoke(`user-data/?id=${id}`, {
      method: "GET",
    })
    .then(({ data, error }) => {
      if (error) throw error;

      return {
        id: data.user_id,
        profileId: data.profile_id,
        firstName: data.first_name,
        lastName: data.last_name,
        role: data.role,
        email: data.email,
        expertise: data.expertise,
        yearsOfExperience: data.year_of_experience,
        organization: {
          id: data.organization?.id,
          nid: data.organization?.nid,
          name: data.organization?.name,
          colourCode: data.organization?.colour_code,
        },
        joinedAt: data.created_at,
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
        profileId: data.data.profile_id || "", 
        firstName: data.data.first_name,
        lastName: data.data.last_name,
        expertise: data.data.expertise,
        yearsOfExperience: data.data.year_of_experience,
        role: data.data.role,
        email: data.data.email,
        joinedAt: data.data.created_at,
      };
    });
}

export function updateUserOrganization({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string;
}): Promise<User> {
  const supabase = createClient();

  return supabase.functions
    .invoke(`user-data/organization?user_id=${userId}`, {
      method: "PUT",
      body: {
        organization_id: organizationId,
      },
    })
    .then(async ({ data, response }) => {
      if (response?.ok === false) {
        const resp = await response?.json();
        throw resp.error;
      }

      return {
        id: data.data.user_id,
        profileId: data.data.profile_id || "", 
        firstName: data.data.first_name,
        lastName: data.data.last_name,
        expertise: data.data.expertise,
        yearsOfExperience: data.data.year_of_experience,
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

export function getUserActivitySummary(
  profieId: string
): Promise<UserActivitySummary> {
  const supabase = createClient();

  return supabase.functions
    .invoke(`activity-logs/summaries?profileid=${profieId}`, {
      method: "GET",
    })
    .then(({ data, error }) => {
      if (error) throw error;

      return {
        totalHerbarium: data?.total_herbarium || 0,
        topFamily: data?.top_family || "",
        data:
          data.data.map((item: LogItemApi) => {
            return {
              familyId: item.family_id,
              familyName: item.family_name,
              totalHerbarium: item.total_herbarium,
            };
          }) || [],
      };
    });
}

export function getActivityLogs(queryParams: {
  page?: number;
  limit?: number;
  profileId?: string;
  search?: string;
  action?: string;
}): Promise<{
  data: Log[];
  pagination: Pagination;
}> {
  const supabase = createClient();

  const params = new URLSearchParams();

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === "profileId") {
        params.append("profileid", String(value));
      } else {
        params.append(key, String(value));
      }
    }
  });

  return supabase.functions
    .invoke(`activity-logs?${params.toString()}`, {
      method: "GET",
    })
    .then(({ data, error }) => {
      if (error) throw error;

      return {
        data: data.data.map((log: LogApi) => {
          return {
            id: log.id,
            actionDate: log.action_date,
            action: log.action,
            updateType: log.update_type,
            changes: log.changes,
            name: log.name,
            dataId: log.data_id,
          };
        }),
        pagination: data.pagination,
      };
    });
}
