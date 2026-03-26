import { getUserByUsername } from "@/lib/data/server/user";
import { notFound } from "next/navigation";
import TraderComponent from "./components/traderComponent";

export default async function TraderPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  console.log("Fetching profile for username:", username);

  const profile = await getUserByUsername(username);

  if (!profile) return notFound();

  return <TraderComponent profile={profile} username={username} />;
}
