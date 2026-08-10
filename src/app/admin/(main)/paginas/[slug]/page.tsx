import { notFound } from "next/navigation";
import { getPageDefinition } from "@/lib/pageContent/schemas";
import { readPageContent } from "@/lib/pageContent/storage";
import { buildHeaderEditorState } from "@/lib/pageContent/headerNav";
import { normalizeSiteLanguage } from "@/lib/i18n";
import { HeaderPageEditor } from "../../../HeaderPageEditor";
import { PageEditor } from "../../../PageEditor";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string | string[] }>;
};

export default async function AdminEditPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const language = normalizeSiteLanguage(sp.lang);
  const definition = getPageDefinition(slug);
  if (!definition) notFound();

  const content = await readPageContent(slug, language);

  if (slug === "home-header") {
    return (
      <HeaderPageEditor
        key={language}
        language={language}
        initial={buildHeaderEditorState(content)}
      />
    );
  }

  return (
    <PageEditor
      key={language}
      definition={definition}
      content={content}
      language={language}
    />
  );
}
