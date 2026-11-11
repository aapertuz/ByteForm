import { insertForm } from "@/shared/lib/db/forms";
import type { Metadata } from "next";
import { getCurrentUser } from "@/shared/lib/auth/server";
import { redirect } from "next/navigation";
import { GuestBuilderShell } from "@/features/builder/components/GuestBuilderShell";
import { CreationJourney } from "@/features/creation/CreationJourney";
import { generateSlug } from "@/shared/lib/slug";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function NewFormPage({
  searchParams,
}: {
  searchParams: Promise<{
    prompt?: string | string[];
    mode?: string | string[];
  }>;
}) {
  const { prompt, mode } = await searchParams;
  const requestedMode =
    mode === "chat" || mode === "classic" ? mode : undefined;
  const initialDescription =
    typeof prompt === "string" ? prompt.trim().slice(0, 1000) : "";
  const user = await getCurrentUser();

  if (user) {
    // Logged-in: create a blank form in their account and go straight to it
    const title = "Untitled Form";
    const { data: form, error } = await insertForm({
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
      });

    if (!error && form) {
      redirect(
        `/builder/${form.id}${requestedMode ? `?mode=${requestedMode}` : ""}`,
      );
    }

    // Form creation failed — fall back to dashboard
    redirect("/dashboard");
  }

  if (initialDescription) {
    return <CreationJourney prompt={initialDescription} mode={requestedMode} />;
  }

  // Guests without a prompt can still explore the manual builder.
  return (
    <GuestBuilderShell
      initialDescription={initialDescription}
      requestedMode={requestedMode}
    />
  );
}
