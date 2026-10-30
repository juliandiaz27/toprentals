import { LoginForm } from "./LoginForm";
import "../admin.css";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <div className="admin-login fixed inset-0 z-[100] overflow-y-auto">
      <aside className="admin-login__brand" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/brand/logo-footer.png" alt="" width={186} height={91} />
        <div>
          <h2>Gestioná el sitio de Top Rentals.</h2>
          <p>Edificios, páginas, blog y marketing en un solo lugar. Los cambios se publican al guardar.</p>
        </div>
        <div className="admin-login__shapes">
          <span style={{ height: "7rem", background: "#f1992c" }} />
          <span style={{ height: "10rem", background: "#cae5f6" }} />
          <span style={{ height: "5.5rem", background: "#fd5627" }} />
        </div>
      </aside>

      <div className="admin-login__form">
        <div className="admin-login-card">
          <p className="admin-eyebrow">Panel de gestión</p>
          <h1 className="mt-2">Iniciá sesión</h1>
          <p className="mt-2 text-sm">
            Ingresá con tu email y contraseña. Si todavía no tenés usuario, dejá el email vacío y
            usá la contraseña general.
          </p>
          <div className="mt-7">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
