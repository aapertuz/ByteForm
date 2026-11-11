import { getCurrentUser } from "@/shared/lib/auth/server";
import { redirect } from "next/navigation";
import { GuestHomePage } from "@/features/builder/components/GuestHomePage";
import { getAllPosts } from "@/lib/blog";

export default async function Home() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  const posts = getAllPosts().slice(0, 3);

  return <GuestHomePage posts={posts} />;
}
