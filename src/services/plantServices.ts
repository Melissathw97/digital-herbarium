import {
  Plant,
  PlantApi,
  Pagination,
  PlantOCRPayload,
  PlantUpdatePayload,
  PlantAiDetectionPayload,
  FileResponse,
  PlantPublishPayload,
} from "@/types/plant";
import { createClient } from "@/utils/supabase/client";
import {
  downloadFileFromAPI,
  generateTimestampedFilename,
} from "@/utils/fileDownload";

export async function getPlants(queryParams: {
  page?: number;
  limit?: number;
  organization?: string | null;
  family?: string | null;
  action?: string | null;
}): Promise<{
  data: Plant[];
  pagination: Pagination;
}> {
  const supabase = createClient();

  // Convert object → URLSearchParams
  const params = new URLSearchParams();

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        // If the value is an array, append each item with the same key.
        value.forEach((val) => {
          params.append(key, String(val));
        });
      } else {
        params.append(key, String(value));
      }
    }
  });

  return supabase.functions
    .invoke(`plant-data?${params.toString()}`, {
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
          imageUrl: plant.image_url,
          vernacularName: plant.vernacular,
          actionType: plant.action_type,
          status: plant.status,
          confidenceLevel: plant.confidence_level,
          creatorEmail: plant.creator_email,
          creatorFirstName: plant.creator_first_name,
          creatorLastName: plant.creator_last_name,
          organization: plant.organizations,
          isPublished: plant.is_published,
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
        latitude: data.latitude,
        longitude: data.longitude,
        elevation: data.elevation,
        imagePath: data.image_path,
        vernacularName: data.vernacular,
        actionType: data.action_type,
        status: data.status,
        isPublished: data.is_published,
        confidenceLevel: data.confidence_level,
        creatorEmail: data.creator_email,
        creatorFirstName: data.creator_first_name,
        creatorLastName: data.creator_last_name,
        remarks: data.remarks,
        additionalNotes: data.additional_notes,
        organization: data.organizations,
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
      if (error) return error;

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
  elevation,
  latitude,
  longitude,
  vernacularName,
  additionalNotes,
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
    elevation,
    latitude,
    longitude,
    additionalNotes,
    collected_at: date.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
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
        throw resp.details;
      }

      return data.data;
    });
}

export async function postPlantAiDetection({
  image,
  family,
  species,
  confidenceLevel,
  barcode,
  prefix,
  number,
  collector,
  date,
  state,
  district,
  location,
  elevation,
  latitude,
  longitude,
  vernacularName,
  additionalNotes,
}: PlantAiDetectionPayload): Promise<Plant> {
  const supabase = createClient();

  const payload = {
    image,
    family,
    species,
    ...(confidenceLevel ? { confidence_level: confidenceLevel } : {}),
    vernacular: vernacularName,
    barcode,
    prefix,
    number,
    collector,
    state,
    district,
    location,
    elevation,
    latitude,
    longitude,
    additionalNotes,
    collected_at: date.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
  };

  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    formData.append(key, value as string | Blob);
  });

  return supabase.functions
    .invoke(`detection-data/ai`, {
      body: formData,
    })
    .then(async ({ data, response }) => {
      if (response?.ok === false) {
        const resp = await response?.json();
        throw resp.details;
      }

      return data.data;
    });
}

export async function updatePlant({
  id,
  actionType,
  vernacularName,
  barcode,
  prefix,
  number,
  collector,
  date,
  state,
  district,
  location,
  confidenceLevel,
  species,
  family,
  elevation,
  latitude,
  longitude,
  additionalNotes,
  status,
  remarks,
}: PlantUpdatePayload): Promise<Plant> {
  const supabase = createClient();

  const payload = {
    action_type: actionType,
    vernacular: vernacularName,
    prefix,
    barcode,
    number,
    collector,
    state,
    district,
    location,
    elevation,
    latitude,
    longitude,
    additional_notes: additionalNotes,
    family_name: family,
    species_name: species,
    collected_at: date.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
    ...(confidenceLevel ? { confidence_level: confidenceLevel } : {}),
    ...(status ? { status } : {}),
    ...(remarks ? { remarks } : {}),
  };

  return supabase.functions
    .invoke(`plant-data/?id=${id}`, {
      method: "PUT",
      body: payload,
    })
    .then(async ({ data, response }) => {
      if (response?.ok === false) {
        const resp = await response?.json();
        throw resp.error;
      }

      return data.data;
    });
}

export async function updatePlantImage({
  id,
  image,
}: {
  id: string;
  image?: File;
}): Promise<Plant> {
  const supabase = createClient();

  const formData = new FormData();
  if (image) formData.append("image", image);

  return supabase.functions
    .invoke(`plant-data/image?id=${id}`, {
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

export async function publishPlant({
  id,
  isPublished,
}: PlantPublishPayload): Promise<Plant> {
  const supabase = createClient();

  return supabase.functions
    .invoke(`plant-data/?id=${id}`, {
      method: "PATCH",
      body: {
        is_published: isPublished,
      },
    })
    .then(async ({ data, response, error }) => {
      if (error) throw error;

      if (response?.ok === false) {
        const resp = await response?.json();
        throw resp.error;
      }

      return data.data;
    });
}

export async function deletePlants({ ids }: { ids: string[] }): Promise<Plant> {
  const supabase = createClient();

  return supabase.functions
    .invoke("plant-data/complete", {
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

export async function getTemplate() {
  const supabase = createClient();

  return supabase.functions
    .invoke("import-excel/template", {
      method: "GET",
    })
    .then(({ data, error }) => {
      if (error) throw error;

      return {
        data: data.files,
      };
    });
}

export async function postImport(file: File): Promise<FileResponse> {
  const supabase = createClient();

  const payload = {
    file,
  };

  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    formData.append(key, value);
  });

  return supabase.functions
    .invoke("import-excel", {
      body: formData,
    })
    .then(async ({ data, response }) => {
      if (response?.ok === false) {
        const resp = await response?.json();
        throw resp;
      }

      return data;
    });
}
