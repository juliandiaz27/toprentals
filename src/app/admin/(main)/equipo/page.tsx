import { getAdminSession } from "@/lib/auth";
import { readAdminUsers, toPublicUser } from "@/lib/adminUsers";
import { TeamManager } from "../../TeamManager";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  const [session, users] = await Promise.all([getAdminSession(), readAdminUsers()]);
  return (
    <TeamManager
      users={users.map(toPublicUser)}
      currentUserId={session?.uid ?? ""}
      isOwner={session?.role === "owner"}
      usingGeneralPassword={session?.uid === "owner"}
    />
  );
}
