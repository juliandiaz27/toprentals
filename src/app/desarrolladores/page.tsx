import { redirect } from "next/navigation";

/** Alias legacy: el CTA del home debe ir a Real Estate. */
export default function DesarrolladoresPage() {
  redirect("/real-estate");
}
