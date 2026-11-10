import { createClient } from "@/shared/lib/supabase/server";
import { redirect } from "next/navigation";
import { GuestBuilderShell } from "@/features/builder/components/GuestBuilderShell";
import { generateSlug } from "@/shared/lib/slug";

export default async function NewFormPage({
  searchParams,
}: {
  searchParams: Promise<{ prompt?: string | string[]; mode?: string | string[] }>;
}) {
  const { prompt, mode } = await searchParams;
  const requestedMode = mode === "chat" || mode === "classic" ? mode : undefined;
  const initialDescription =
    typeof prompt === "string" ? prompt.trim().slice(0, 1000) : "";
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Logged-in: create a blank form in their account and go straight to it
    const title = "Untitled Form";
    const { data: form, error } = await supabase
      .from("forms")
      .insert({
        user_id: user.id,
        title,
        slug: generateSlug(title),
        welcome_screen: {
          title: "Welcome",
          description:
            initialDescription ||
            "We'd love to hear from you. It only takes a few minutes.",
          buttonText: "Start",
        },
        thank_you_screen: {
          title: "Thank you!",
          description: "Your response has been recorded.",
        },
        questions: [],
      })
      .select()
      .single();

    if (!error && form) {
      redirect(`/builder/${form.id}${requestedMode ? `?mode=${requestedMode}` : ""}`);
    }

    // Form creation failed — fall back to dashboard
    redirect("/dashboard");
  }

  // Guest: full-screen builder with sign-up gate on save/publish
  return <GuestBuilderShell initialDescription={initialDescription} requestedMode={requestedMode} />;
}
