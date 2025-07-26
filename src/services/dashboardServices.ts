import { Family, FamilyApi } from "@/types/dashboard";
import { createClient } from "@/utils/supabase/client";

export async function getTopFamilies(): Promise<Family[]> {
  const supabase = createClient();

  return supabase.functions
    .invoke(`dashboard-data/families`, {
      method: "GET",
    })
    .then(({ data, error }) => {
      if (error) throw error;

      return data.map((family: FamilyApi) => ({
          name: family.family_name,
          total: family.total_collections
        }))
    });
}
