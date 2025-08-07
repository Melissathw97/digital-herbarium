import { PlantImageToBase64Api } from "@/types/plant";
import { createClient } from "@/utils/supabase/client";

export async function postImageToBase64({
  image,
}: {
  image: File;
}): Promise<PlantImageToBase64Api> {
  const supabase = createClient();

  const payload = {
    image,
  };

  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    formData.append(key, value);
  });

  return supabase.functions
    .invoke(`converter/image-to-base64`, {
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

export async function postAiDetection({ image }: { image: string }) {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch("/api/predict", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image_base64: image,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail);
  }

  return data;
}
