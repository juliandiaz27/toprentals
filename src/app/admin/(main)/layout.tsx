import { getAdminSession } from "@/lib/auth";
import { AdminShell } from "../AdminShell";
import "../admin.css";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  return (
    <AdminShell
      user={{
        name: session?.name ?? "Administrador",
        role: session?.role ?? "owner",
        general: !session || session.uid === "owner",
      }}
    >
      {children}
    </AdminShell>
  );
}
