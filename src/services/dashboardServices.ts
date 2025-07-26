import { createClient } from "@/utils/supabase/client";
import { Family, FamilyApi, State, StateApi } from "@/types/dashboard";

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

export async function getTopStates(): Promise<State[]> {
  const supabase = createClient();

  return supabase.functions
    .invoke(`dashboard-data/state`, {
      method: "GET",
    })
    .then(({ data, error }) => {
      if (error) throw error;

      return data.map((state: StateApi) => ({
          name: state.state_name,
          total: state.total_collections
        }))
    });
}
