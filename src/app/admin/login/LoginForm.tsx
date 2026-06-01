"use client";

import { useActionState } from "react";
import { login, type ActionResult } from "../actions";

const initial: ActionResult | null = null;

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initial);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="admin-field-label">Contraseña</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="admin-input"
        />
      </label>
      {state && !state.ok ? (
        <p className="admin-alert-error" role="alert">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="admin-btn-primary w-full"
      >
        {pending ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}
