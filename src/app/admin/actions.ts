"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE,
  getAdminToken,
  isAuthed,
} from "@/lib/auth";
import { readImageConfig, writeImageConfig } from "@/lib/imageConfig";
import { saveUpload, deleteUploadByUrl } from "@/lib/upload";
import { revalidateConfigImages, revalidateEntity, type EntityKind } from "@/lib/revalidate";
import { slugify } from "@/lib/slug";
import { readProfesores, writeProfesores, type Profesor } from "@/lib/profesoresData";
import { readEgresados, writeEgresados, type Egresado } from "@/lib/egresadosData";
import { readCarreras, writeCarreras, type Carrera } from "@/lib/carrerasData";
import { readCursos, writeCursos, type Curso } from "@/lib/cursosData";
import { readPostitulos, writePostitulos, type Postitulo } from "@/lib/postitulosData";
import { readBeneficios, writeBeneficios, type Beneficio } from "@/lib/beneficiosData";
import type { EntityImageKind } from "@/lib/adminImageSlots";

export type ActionResult = {
  ok: boolean;
  error?: string;
};

async function requireAuth(): Promise<void> {
  if (!(await isAuthed())) {
    throw new Error("No autorizado");
  }
}

export async function login(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const password = String(formData.get("password") ?? "");
  const token = getAdminToken();

  if (!token) {
    return { ok: false, error: "ADMIN_TOKEN no está configurado en el servidor." };
  }

  if (password !== token) {
    return { ok: false, error: "Contraseña incorrecta." };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/admin/paginas/home");
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/login");
}

export async function uploadImage(
  key: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await requireAuth();
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return { ok: false, error: "Seleccioná una imagen." };
    }
    const url = await saveUpload(file, key);
    const config = await readImageConfig();
    config[key] = url;
    await writeImageConfig(config);
    revalidateConfigImages();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error al subir." };
  }
}

export async function removeImage(key: string): Promise<ActionResult> {
  try {
    await requireAuth();
    const config = await readImageConfig();
    const current = config[key];
    if (current?.startsWith("/uploads/")) {
      await deleteUploadByUrl(current);
    }
    delete config[key];
    await writeImageConfig(config);
    revalidateConfigImages();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error al restablecer." };
  }
}

async function updateEntityImage(
  kind: EntityImageKind,
  id: string,
  imageSrc: string,
): Promise<void> {
  switch (kind) {
    case "profesores": {
      const data = await readProfesores();
      const idx = data.items.findIndex((i) => i.id === id);
      if (idx === -1) throw new Error("Ítem no encontrado");
      data.items[idx] = { ...data.items[idx], imageSrc };
      await writeProfesores(data);
      break;
    }
    case "egresados": {
      const data = await readEgresados();
      const idx = data.items.findIndex((i) => i.id === id);
      if (idx === -1) throw new Error("Ítem no encontrado");
      data.items[idx] = { ...data.items[idx], imageSrc };
      await writeEgresados(data);
      break;
    }
    case "carreras": {
      const data = await readCarreras();
      const idx = data.items.findIndex((i) => i.id === id);
      if (idx === -1) throw new Error("Ítem no encontrado");
      data.items[idx] = { ...data.items[idx], imageSrc };
      await writeCarreras(data);
      break;
    }
    case "cursos": {
      const data = await readCursos();
      const idx = data.items.findIndex((i) => i.id === id);
      if (idx === -1) throw new Error("Ítem no encontrado");
      data.items[idx] = { ...data.items[idx], imageSrc };
      await writeCursos(data);
      break;
    }
    case "postitulos": {
      const data = await readPostitulos();
      const idx = data.items.findIndex((i) => i.id === id);
      if (idx === -1) throw new Error("Ítem no encontrado");
      data.items[idx] = { ...data.items[idx], imageSrc };
      await writePostitulos(data);
      break;
    }
  }
  revalidateEntity(kind);
}

export async function uploadEntityImage(
  kind: EntityImageKind,
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await requireAuth();
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return { ok: false, error: "Seleccioná una imagen." };
    }
    const url = await saveUpload(file, `${kind}-${id}`);
    await updateEntityImage(kind, id, url);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error al subir." };
  }
}

// ——— Profesores ———

export async function saveProfesor(formData: FormData): Promise<ActionResult> {
  try {
    await requireAuth();
    const id = String(formData.get("id") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    const role = String(formData.get("role") ?? "").trim();
    let imageSrc = String(formData.get("imageSrc") ?? "").trim();

    if (!name || !role) {
      return { ok: false, error: "Nombre y rol son obligatorios." };
    }

    const file = formData.get("image");
    if (file instanceof File && file.size > 0) {
      const newId = id || `prof-${Date.now()}`;
      imageSrc = await saveUpload(file, `profesores-${newId}`);
    }

    const data = await readProfesores();
    const existingIdx = id ? data.items.findIndex((p) => p.id === id) : -1;
    const finalId = id || `prof-${Date.now()}`;

    const item: Profesor = {
      id: finalId,
      name,
      role,
      imageSrc: imageSrc || "/images/placeholders/person.svg",
    };

    if (existingIdx >= 0) {
      data.items[existingIdx] = item;
    } else {
      data.items.push(item);
    }

    await writeProfesores(data);
    revalidateEntity("profesores");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error al guardar." };
  }
}

export async function deleteProfesor(id: string): Promise<ActionResult> {
  try {
    await requireAuth();
    const data = await readProfesores();
    const item = data.items.find((p) => p.id === id);
    if (item?.imageSrc.startsWith("/uploads/")) {
      await deleteUploadByUrl(item.imageSrc);
    }
    data.items = data.items.filter((p) => p.id !== id);
    await writeProfesores(data);
    revalidateEntity("profesores");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error al eliminar." };
  }
}

// ——— Egresados (esqueleto CRUD) ———

export async function saveEgresado(formData: FormData): Promise<ActionResult> {
  try {
    await requireAuth();
    const id = String(formData.get("id") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    const career = String(formData.get("career") ?? "").trim();
    const year = Number(formData.get("year") ?? 0);
    let imageSrc = String(formData.get("imageSrc") ?? "").trim();

    if (!name || !career) {
      return { ok: false, error: "Nombre y carrera son obligatorios." };
    }

    const file = formData.get("image");
    const finalId = id || `egr-${Date.now()}`;
    if (file instanceof File && file.size > 0) {
      imageSrc = await saveUpload(file, `egresados-${finalId}`);
    }

    const item: Egresado = {
      id: finalId,
      name,
      career,
      year: year || new Date().getFullYear(),
      imageSrc: imageSrc || "/images/placeholders/person.svg",
    };

    const data = await readEgresados();
    const idx = id ? data.items.findIndex((e) => e.id === id) : -1;
    if (idx >= 0) data.items[idx] = item;
    else data.items.push(item);
    await writeEgresados(data);
    revalidateEntity("egresados");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error al guardar." };
  }
}

export async function deleteEgresado(id: string): Promise<ActionResult> {
  try {
    await requireAuth();
    const data = await readEgresados();
    const item = data.items.find((e) => e.id === id);
    if (item?.imageSrc.startsWith("/uploads/")) await deleteUploadByUrl(item.imageSrc);
    data.items = data.items.filter((e) => e.id !== id);
    await writeEgresados(data);
    revalidateEntity("egresados");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error al eliminar." };
  }
}

// ——— Carreras ———

function parseProgramForm(formData: FormData, prefix: string) {
  return {
    id: String(formData.get("id") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    visible: formData.get("visible") === "on" || formData.get("visible") === "true",
    modalidad: String(formData.get("modalidad") ?? "").trim(),
    duracion: String(formData.get("duracion") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    requisitos: String(formData.get("requisitos") ?? "").trim(),
    imageSrc: String(formData.get("imageSrc") ?? "").trim(),
    file: formData.get("image"),
    uploadPrefix: prefix,
  };
}

export async function saveCarrera(formData: FormData): Promise<ActionResult> {
  try {
    await requireAuth();
    const f = parseProgramForm(formData, "carreras");
    if (!f.title) return { ok: false, error: "El título es obligatorio." };

    const finalId = f.id || `car-${Date.now()}`;
    const slug = f.slug || slugify(f.title);
    let imageSrc = f.imageSrc;
    if (f.file instanceof File && f.file.size > 0) {
      imageSrc = await saveUpload(f.file, `carreras-${finalId}`);
    }

    const item: Carrera = {
      id: finalId,
      slug,
      title: f.title,
      visible: f.visible,
      imageSrc: imageSrc || "/images/placeholders/program.svg",
      modalidad: f.modalidad,
      duracion: f.duracion,
      location: f.location,
      description: f.description,
      requisitos: f.requisitos,
    };

    const data = await readCarreras();
    const idx = f.id ? data.items.findIndex((c) => c.id === f.id) : -1;
    if (idx >= 0) data.items[idx] = item;
    else data.items.push(item);
    await writeCarreras(data);
    revalidateEntity("carreras");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error al guardar." };
  }
}

export async function deleteCarrera(id: string): Promise<ActionResult> {
  try {
    await requireAuth();
    const data = await readCarreras();
    const item = data.items.find((c) => c.id === id);
    if (item?.imageSrc.startsWith("/uploads/")) await deleteUploadByUrl(item.imageSrc);
    data.items = data.items.filter((c) => c.id !== id);
    await writeCarreras(data);
    revalidateEntity("carreras");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error al eliminar." };
  }
}

// ——— Cursos ———

export async function saveCurso(formData: FormData): Promise<ActionResult> {
  try {
    await requireAuth();
    const f = parseProgramForm(formData, "cursos");
    if (!f.title) return { ok: false, error: "El título es obligatorio." };

    const finalId = f.id || `cur-${Date.now()}`;
    const slug = f.slug || slugify(f.title);
    let imageSrc = f.imageSrc;
    if (f.file instanceof File && f.file.size > 0) {
      imageSrc = await saveUpload(f.file, `cursos-${finalId}`);
    }

    const item: Curso = {
      id: finalId,
      slug,
      title: f.title,
      visible: f.visible,
      imageSrc: imageSrc || "/images/placeholders/program.svg",
      modalidad: f.modalidad,
      duracion: f.duracion,
      location: f.location,
      description: f.description,
    };

    const data = await readCursos();
    const idx = f.id ? data.items.findIndex((c) => c.id === f.id) : -1;
    if (idx >= 0) data.items[idx] = item;
    else data.items.push(item);
    await writeCursos(data);
    revalidateEntity("cursos");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error al guardar." };
  }
}

export async function deleteCurso(id: string): Promise<ActionResult> {
  try {
    await requireAuth();
    const data = await readCursos();
    const item = data.items.find((c) => c.id === id);
    if (item?.imageSrc.startsWith("/uploads/")) await deleteUploadByUrl(item.imageSrc);
    data.items = data.items.filter((c) => c.id !== id);
    await writeCursos(data);
    revalidateEntity("cursos");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error al eliminar." };
  }
}

// ——— Postítulos ———

export async function savePostitulo(formData: FormData): Promise<ActionResult> {
  try {
    await requireAuth();
    const f = parseProgramForm(formData, "postitulos");
    if (!f.title) return { ok: false, error: "El título es obligatorio." };

    const finalId = f.id || `pos-${Date.now()}`;
    const slug = f.slug || slugify(f.title);
    let imageSrc = f.imageSrc;
    if (f.file instanceof File && f.file.size > 0) {
      imageSrc = await saveUpload(f.file, `postitulos-${finalId}`);
    }

    const item: Postitulo = {
      id: finalId,
      slug,
      title: f.title,
      visible: f.visible,
      imageSrc: imageSrc || "/images/placeholders/program.svg",
      modalidad: f.modalidad,
      duracion: f.duracion,
      location: f.location,
      description: f.description,
    };

    const data = await readPostitulos();
    const idx = f.id ? data.items.findIndex((p) => p.id === f.id) : -1;
    if (idx >= 0) data.items[idx] = item;
    else data.items.push(item);
    await writePostitulos(data);
    revalidateEntity("postitulos");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error al guardar." };
  }
}

export async function deletePostitulo(id: string): Promise<ActionResult> {
  try {
    await requireAuth();
    const data = await readPostitulos();
    const item = data.items.find((p) => p.id === id);
    if (item?.imageSrc.startsWith("/uploads/")) await deleteUploadByUrl(item.imageSrc);
    data.items = data.items.filter((p) => p.id !== id);
    await writePostitulos(data);
    revalidateEntity("postitulos");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error al eliminar." };
  }
}

// ——— Beneficios ———

export async function saveBeneficio(formData: FormData): Promise<ActionResult> {
  try {
    await requireAuth();
    const id = String(formData.get("id") ?? "").trim();
    const title = String(formData.get("title") ?? "").trim();
    const discount = String(formData.get("discount") ?? "").trim();
    const url = String(formData.get("url") ?? "").trim();
    const visible =
      formData.get("visible") === "on" || formData.get("visible") === "true";
    let imageSrc = String(formData.get("imageSrc") ?? "").trim();

    if (!title) return { ok: false, error: "El título es obligatorio." };

    const finalId = id || `ben-${Date.now()}`;
    const file = formData.get("image");
    if (file instanceof File && file.size > 0) {
      imageSrc = await saveUpload(file, `beneficios-${finalId}`);
    }

    const item: Beneficio = {
      id: finalId,
      title,
      discount,
      url,
      imageSrc: imageSrc || "/images/placeholders/benefit.svg",
      visible,
    };

    const data = await readBeneficios();
    const idx = id ? data.items.findIndex((b) => b.id === id) : -1;
    if (idx >= 0) data.items[idx] = item;
    else data.items.push(item);
    await writeBeneficios(data);
    revalidateEntity("beneficios");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error al guardar." };
  }
}

export async function deleteBeneficio(id: string): Promise<ActionResult> {
  try {
    await requireAuth();
    const data = await readBeneficios();
    const item = data.items.find((b) => b.id === id);
    if (item?.imageSrc.startsWith("/uploads/")) await deleteUploadByUrl(item.imageSrc);
    data.items = data.items.filter((b) => b.id !== id);
    await writeBeneficios(data);
    revalidateEntity("beneficios");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error al eliminar." };
  }
}
