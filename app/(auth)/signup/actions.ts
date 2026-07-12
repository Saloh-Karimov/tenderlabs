"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/utils/supabase/server";

const signupSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(72),
});

export async function signup(formData: FormData) {
  const parsed = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    redirect("/signup?error=invalid_input");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp(parsed.data);

  if (error) {
    redirect("/signup?error=signup_failed");
  }

  redirect("/signup?sent=1");
}
