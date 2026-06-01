import type { CSSProperties, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Retardo en ms (stagger). */
  delay?: number;
  as?: "div" | "section" | "article" | "li";
};

/** Wrapper server-safe: solo añade data-reveal para el observer global. */
export function Reveal({
  children,
  className,
  delay,
  as: Tag = "div",
}: Props) {
  const style: CSSProperties | undefined =
    delay != null
      ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties)
      : undefined;

  return (
    <Tag
      data-reveal
      data-reveal-delay={delay != null ? String(delay) : undefined}
      className={className}
      style={style}
    >
      {children}
    </Tag>
  );
}
