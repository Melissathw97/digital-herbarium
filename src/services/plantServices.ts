import {
  Plant,
  PlantApi,
  Pagination,
  PlantAiDetectionPayload,
  PlantOCRPayload,
} from "@/types/plant";
import { createClient } from "@/utils/supabase/client";
import {
  downloadFileFromAPI,
  generateTimestampedFilename,
} from "@/utils/fileDownload";

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
          confidenceLevel: plant.confidence_level,
        })),
        pagination: data.pagination,
      };
    });
}

export async function getPlantById({ id }: { id: string }): Promise<Plant> {
  const supabase = createClient();

  return supabase.functions
    .invoke(`plant-data/?id=${id}`, {
      method: "GET",
    })
    .then(({ data, error }) => {
      if (error) throw error;

      return {
        id: data.id,
        family: data.family_name,
        species: data.species_name,
        barcode: data.barcode,
        prefix: data.prefix,
        number: data.number,
        collector: data.collector,
        date: data.collected_at,
        state: data.state,
        district: data.district,
        location: data.location,
        imagePath: data.image_path,
        vernacularName: data.vernacular,
        actionType: data.action_type,
        confidenceLevel: data.confidence_level,
      };
    });
}

export async function getPlantImage({
  id,
}: {
  id: string;
}): Promise<{ imageUrl: string }> {
  const supabase = createClient();

  return supabase.functions
    .invoke(`plant-data/image?id=${id}`, {
      method: "GET",
    })
    .then(({ data, error }) => {
      if (error) throw error;

      return {
        imageUrl: data.image_url,
      };
    });
}

// export async function postPlantsExport({ ids }: { ids: string[] }) {
//   const supabase = createClient();

//   return supabase.functions
//     .invoke("export-excel", {
//       body: { ...(ids.length > 0 ? { id: ids } : {}) },
//     })
//     .then(async ({ data, response }) => {
//       if (response?.ok === false) {
//         const resp = await response?.json();
//         throw resp.error;
//       }

//       return data;
//     });
// }

export async function postPlantsExport({ ids }: { ids: string[] }) {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Not authenticated");
  }

  try {
    await downloadFileFromAPI({
      url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/export-excel`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ ...(ids.length > 0 ? { id: ids } : {}) }),
      filename: generateTimestampedFilename("data_captured_export", "xlsx"),
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    return { success: true };
  } catch (error) {
    console.error("Export error:", error);
    throw error;
  }
}

export async function postPlantOCR({
  image,
  family,
  species,
  barcode,
  prefix,
  number,
  collector,
  date,
  state,
  district,
  location,
  vernacularName,
}: PlantOCRPayload): Promise<Plant> {
  const supabase = createClient();

  const payload = {
    image,
    family,
    species,
    vernacular: vernacularName,
    barcode,
    prefix,
    number,
    collector,
    state,
    district,
    location,
    collected_at: date.toISOString().split("T")[0],
  };

  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    formData.append(key, value);
  });

  return supabase.functions
    .invoke(`detection-data/ocr`, {
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

export async function postPlantAiDetection({
  family,
  species,
  confidenceLevel,
}: PlantAiDetectionPayload): Promise<Plant> {
  const supabase = createClient();

  return supabase.functions
    .invoke(`detection-data/ai`, {
      body: {
        family,
        species,
        confidence_level: confidenceLevel,
      },
    })
    .then(async ({ data, response }) => {
      if (response?.ok === false) {
        const resp = await response?.json();
        throw resp.error;
      }

      return data.data;
    });
}

export async function deletePlant({ id }: { id: string }): Promise<Plant> {
  const supabase = createClient();

  return supabase.functions
    .invoke(`plant-data/?id=${id}`, {
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
