export async function submitApplication(
  method: "POST" | "PATCH",
  payload: Record<string, string>,
) {
  const response = await fetch("/api/applications", {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok || result?.saved !== true) {
    throw new Error(
      result?.error || "We couldn’t save this. Please try again.",
    );
  }
}
