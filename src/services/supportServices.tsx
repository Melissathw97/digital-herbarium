import { SupportPayload, SupportResponse } from "@/types/support";
import { createClient } from "@/utils/supabase/client";

export async function postSupport(payload: SupportPayload): Promise<SupportResponse> {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/support`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Fail to submit: ${response.status} - ${error}`);
  }

  const result = await response.json();
  return result;
}
