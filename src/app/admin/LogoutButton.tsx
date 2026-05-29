"use client";

import { useTransition } from "react";
import { logout } from "./actions";

export function LogoutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => logout())}
      className="text-sm text-neutral-500 hover:text-neutral-800 disabled:opacity-50"
    >
      Salir
    </button>
  );
}
