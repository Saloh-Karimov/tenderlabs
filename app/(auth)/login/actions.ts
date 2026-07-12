"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/utils/supabase/server";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export async function login(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    redirect("/login?error=invalid_input");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    redirect("/login?error=auth_failed");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
