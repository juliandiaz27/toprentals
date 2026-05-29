import { notFound } from "next/navigation";
import { getPageDefinition } from "@/lib/pageContent/schemas";
import { readPageContent } from "@/lib/pageContent/storage";
import { PageEditor } from "../../../PageEditor";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function AdminEditPage({ params }: Props) {
  const { slug } = await params;
  const definition = getPageDefinition(slug);
  if (!definition) notFound();

  const content = await readPageContent(slug);

  return <PageEditor definition={definition} content={content} />;
}
