import { notFound } from "next/navigation";
import { getUserByUsername } from "@/lib/data/server/user";
import { TraderProfileView } from "./components/trader-profile-view";
import { PageMotion } from "@/components/layout/motion-wrapper";

export default async function TraderPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const profile = await getUserByUsername(username);

  if (!profile) {
    notFound();
  }

  return (
    <PageMotion>
      <TraderProfileView profile={profile} username={username} />
    </PageMotion>
  );
}
