import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { resolveSiteWhatsAppUrl } from "@/lib/whatsapp";

type Props = {
  url: string;
};

export function WhatsAppFab({ url }: Props) {
  const href = resolveSiteWhatsAppUrl(url);
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-6 z-40 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition hover:scale-105 max-lg:bottom-[calc(var(--mobile-bottom-nav-height)+env(safe-area-inset-bottom,0px)+1rem)] lg:bottom-8 lg:right-10"
      aria-label="WhatsApp"
    >
      <WhatsAppIcon />
    </a>
  );
}
