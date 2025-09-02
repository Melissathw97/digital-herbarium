import { Organization } from "@/types/organization";
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
