import { getResponseCounts } from "@/shared/lib/db/submissions";
import { listForms } from "@/shared/lib/db/forms";
import { getCurrentUser } from "@/shared/lib/auth/server";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/features/dashboard/components/DashboardClient";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: forms } = await listForms(user.id);

  const { data: responseCounts } = await getResponseCounts(user.id);

  return (
    <DashboardClient
      forms={forms ?? []}
      responseCounts={responseCounts ?? {}}
    />
  );
}
