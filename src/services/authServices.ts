import { createClient } from "@/utils/supabase/client";

export function userSignIn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const supabase = createClient();

  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export function userSignUp({
  email,
  password,
  firstName,
  lastName,
}: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) {
  const supabase = createClient();

  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/users/sign-in?confirmed=true`,
    },
  });
}

export function userSignOut() {
  const supabase = createClient();
  return supabase.auth.signOut();
}

export function userResetPassword({ email }: { email: string }) {
  const supabase = createClient();

  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/users/update-password`,
  });
}

export function userUpdatePassword({ newPassword }: { newPassword: string }) {
  const supabase = createClient();

  return supabase.auth.updateUser({
    password: newPassword,
  });
}
