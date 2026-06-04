import { get } from "@vercel/blob";
import { useBlobStorage } from "@/lib/vercelBlob";

export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  if (!useBlobStorage()) {
    return new Response("Not found", { status: 404 });
  }

  const { path: segments } = await context.params;
  const pathname = segments.map(decodeURIComponent).join("/");

  if (!pathname.startsWith("top-rentals/")) {
    return new Response("Not found", { status: 404 });
  }

  const result = await get(pathname, { access: "private" });
  if (!result || result.statusCode !== 200 || !result.stream) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType ?? "application/octet-stream",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
