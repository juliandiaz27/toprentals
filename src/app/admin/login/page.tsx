import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <div className="admin-login fixed inset-0 z-[100] flex items-center justify-center bg-neutral-100">
      <div className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-8 shadow-md">
        <h1 className="text-xl font-semibold text-neutral-900">Panel de administración</h1>
        <p className="mt-1 text-sm text-neutral-500">Ingresá la contraseña de administrador.</p>
        <LoginForm />
      </div>
    </div>
  );
}
