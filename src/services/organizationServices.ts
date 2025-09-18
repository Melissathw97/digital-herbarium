import {
  Organization,
  OrganizationApi,
  OrganizationPayload,
} from "@/types/organization";
import { Pagination } from "@/types/plant";
import { UserApi } from "@/types/user";
import { createClient } from "@/utils/supabase/client";

export async function getOrganizations(): Promise<Organization[]> {
  const supabase = createClient();

  return supabase.functions
    .invoke("organization-list", {
      method: "GET",
    })
    .then(({ data, error }) => {
      if (error) throw error;

      return data.map((organization: Organization) => ({
        id: organization.id,
        name: organization.name,
      }));
    });
}

export async function getOrganizationList({
  search,
  page,
  limit,
}: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{
  data: Organization[];
  pagination: Pagination;
}> {
  let path = `organization?page=${page}&limit=${limit}`;
  if (search) path += `&search=${search}`;

  const supabase = createClient();

  return supabase.functions
    .invoke(path, {
      method: "GET",
    })
    .then(({ data, error }) => {
      if (error) throw error;

      return {
        data: data.data.map((organization: OrganizationApi) => ({
          id: organization.id,
          nid: organization.nid,
          name: organization.name,
          imagePath: organization.image_path,
          colorCode: organization.color_code,
          imageUrl: organization.image_url,
        })),
        pagination: data.pagination,
      };
    });
}

export async function getOrganizationById(
  id: string,
  {
    search,
    page,
    limit,
  }: {
    search?: string;
    page?: number;
    limit?: number;
  }
): Promise<{
  data: Organization;
}> {
  let path = `organization?id=${id}&page=${page}&limit=${limit}`;
  if (search) path += `&search=${search}`;

  const supabase = createClient();

  return supabase.functions
    .invoke(path, {
      method: "GET",
    })
    .then(({ data, error }) => {
      if (error) throw error;

      return {
        data: {
          id: data.id,
          nid: data.nid,
          name: data.name,
          imagePath: data.image_path,
          colorCode: data.color_code,
          imageUrl: data.image_url,
          users: {
            data: data.users.data.map((user: UserApi) => ({
              id: user.user_id,
              firstName: user.first_name,
              lastName: user.last_name,
              role: user.role,
              email: user.email,
              joinedAt: user.created_at,
            })),
            pagination: data.users.pagination,
          },
        },
      };
    });
}

export async function postOrganization(
  payload: OrganizationPayload
): Promise<Organization> {
  const supabase = createClient();

  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (
      typeof value === "object" &&
      value !== null &&
      ["File", "Blob"].includes(value.constructor.name)
    ) {
      formData.append(key, value);
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  return supabase.functions
    .invoke(`organization`, {
      body: formData,
    })
    .then(async ({ data, response }) => {
      if (response?.ok === false) {
        const resp = await response?.json();
        throw resp.error;
      }

      return data.data;
    });
}

export async function updateOrganization(
  id: string,
  organizationPayload: OrganizationPayload
): Promise<Organization> {
  const supabase = createClient();

  let payload: Record<string, any> = {
    nid: organizationPayload.nid,
    name: organizationPayload.name,
  };

  if (organizationPayload.image)
    payload = { ...payload, image: organizationPayload.image };

  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (
      typeof value === "object" &&
      value !== null &&
      ["File", "Blob"].includes(value.constructor.name)
    ) {
      formData.append(key, value);
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  return supabase.functions
    .invoke(`organization?id=${id}`, {
      method: "PUT",
      body: formData,
    })
    .then(async ({ data, response }) => {
      if (response?.ok === false) {
        const resp = await response?.json();
        throw resp.error;
      }

      return data.data;
    });
}

export function deleteOrganization(id: string): Promise<Organization> {
  const supabase = createClient();

  return supabase.functions
    .invoke(`organization?id=${id}`, {
      method: "DELETE",
      body: {
        is_confirmed: "Confirmed",
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
