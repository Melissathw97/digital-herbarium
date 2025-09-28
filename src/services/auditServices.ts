import { Pagination } from "@/types/plant";
import { Log, LogApi } from "@/types/user";
import { createClient } from "@/utils/supabase/client";

export function getPlantLogs(queryParams: {
  page?: number;
  limit?: number;
  search?: string;
  action?: string;
}): Promise<{
  data: Log[];
  pagination: Pagination;
}> {
  const supabase = createClient();

  // Convert object → URLSearchParams
  const params = new URLSearchParams();

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value) {
      params.append(key, String(value));
    }
  });

  return supabase.functions
    .invoke(`audit-logs/plant?${params.toString()}`, {
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
            actionBy: log.action_by,
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

export function getUserLogs({
  page,
  limit,
  search,
  action,
}: {
  page?: number;
  limit?: number;
  search?: string;
  action?: string;
}): Promise<{
  data: Log[];
  pagination: Pagination;
}> {
  const supabase = createClient();

  return supabase.functions
    .invoke(
      `audit-logs/user?search=${search}&action=${action}&page=${page}&limit=${limit}`,
      {
        method: "GET",
      }
    )
    .then(({ data, error }) => {
      if (error) throw error;

      return {
        data: data.data.map((log: LogApi) => {
          return {
            id: log.id,
            actionDate: log.action_date,
            action: log.action,
            actionBy: log.action_by,
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
