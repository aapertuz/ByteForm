import { getCurrentUser } from "@/shared/lib/auth/server";
import { redirect } from "next/navigation";

// /builder (no ID) — redirect logged-in users to dashboard to create a new form,
// or redirect guests to the homepage builder.
export default async function BuilderIndexPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  redirect("/");
}
