import { LoginForm } from "./LoginForm";
import "../admin.css";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <div className="admin-shell fixed inset-0 z-[100] flex items-center justify-center bg-[var(--admin-bg)] p-6">
      <div className="admin-login-card">
        <span className="admin-brand__mark" aria-hidden>
          TR
        </span>
        <h1>Panel de administración</h1>
        <p className="mt-2 text-sm">
          Ingresá la contraseña configurada en <code>ADMIN_TOKEN</code>.
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
