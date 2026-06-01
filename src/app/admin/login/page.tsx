import { LoginForm } from "./LoginForm";
import "../admin.css";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <div className="admin-shell fixed inset-0 z-[100] flex items-center justify-center bg-[#f4f4f5] p-6">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-lg shadow-neutral-900/5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
          Top Rentals
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
          Panel de administración
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Ingresá la contraseña configurada en <code className="text-xs">ADMIN_TOKEN</code>.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
