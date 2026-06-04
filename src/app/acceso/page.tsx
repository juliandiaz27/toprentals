import { redirect } from "next/navigation";
import { CLUB_LOYALTY_PATH } from "@/lib/pageContent/clubCtas";

/** Alias en español de /loyalty */
export default function AccesoPage() {
  redirect(CLUB_LOYALTY_PATH);
}
