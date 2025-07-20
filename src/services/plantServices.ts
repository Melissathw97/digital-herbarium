import { Pagination, Plant, PlantApi } from "@/types/plant";
import { createClient } from "@/utils/supabase/client";

export async function getPlants({
  page,
  limit,
}: {
  page?: number;
  limit?: number;
}): Promise<{
  data: Plant[];
  pagination: Pagination;
}> {
  const supabase = createClient();

  return supabase.functions
    .invoke(`plant-data?page=${page}&limit=${limit}`, {
      method: "GET",
    })
    .then(({ data, error }) => {
      if (error) throw error;

      return {
        data: data.data.map((plant: PlantApi) => ({
          id: plant.id,
          family: plant.family_name,
          species: plant.species_name,
          barcode: plant.barcode,
          prefix: plant.prefix,
          number: plant.number,
          collector: plant.collector,
          date: plant.collected_at,
          state: plant.state,
          district: plant.district,
          location: plant.location,
          imagePath: plant.image_path,
          vernacularName: plant.vernacular,
          actionType: plant.action_type,
        })),
        pagination: data.pagination,
      };
    });
}
