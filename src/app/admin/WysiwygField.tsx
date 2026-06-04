"use client";

import { useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { plainToEditorHtml } from "@/lib/richText/sanitize";

type Props = {
  name: string;
  label: string;
  hint?: string;
  required?: boolean;
  defaultValue: string;
  placeholder?: string;
  className?: string;
  /** Habilita títulos y citas para entradas del blog. */
  variant?: "default" | "blog";
  onHtmlChange?: (html: string) => void;
};

function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`admin-wysiwyg-btn ${active ? "admin-wysiwyg-btn--active" : ""}`}
    >
      {children}
    </button>
  );
}

export function WysiwygField({
  name,
  label,
  hint,
  required,
  defaultValue,
  placeholder,
  className = "",
  variant = "default",
  onHtmlChange,
}: Props) {
  const isBlog = variant === "blog";
  const hiddenRef = useRef<HTMLInputElement>(null);
  const initialHtml = plainToEditorHtml(defaultValue);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: isBlog ? { levels: [2, 3] } : false,
        codeBlock: false,
        code: false,
        blockquote: isBlog ? {} : false,
        horizontalRule: false,
      }),
      Placeholder.configure({
        placeholder: placeholder ?? "Escribí el texto… Enter para un nuevo párrafo.",
      }),
    ],
    content: initialHtml,
    editorProps: {
      attributes: {
        class: "admin-wysiwyg-editor focus:outline-none",
      },
    },
    onUpdate: ({ editor: ed }) => {
      const html = ed.isEmpty ? "" : ed.getHTML();
      if (hiddenRef.current) {
        hiddenRef.current.value = html;
      }
      onHtmlChange?.(html);
    },
  });

  useEffect(() => {
    if (hiddenRef.current && editor) {
      hiddenRef.current.value = editor.isEmpty ? "" : editor.getHTML();
    }
  }, [editor]);

  if (!editor) {
    return (
      <div className={className}>
        <span className="admin-field-label">{label}</span>
        <div className="admin-wysiwyg-shell min-h-[8rem] animate-pulse rounded-lg bg-neutral-100" />
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${className}`}>
      <span className="admin-field-label">
        {label}
        {required ? " *" : ""}
      </span>
      {hint ? <span className="admin-field-hint">{hint}</span> : null}
      <p className="mb-2 text-[11px] text-neutral-400">
        Enter = nuevo párrafo · Shift+Enter = salto de línea
      </p>

      <div className="admin-wysiwyg-shell">
        <div className="admin-wysiwyg-toolbar" role="toolbar" aria-label="Formato de texto">
          <ToolbarButton
            title="Negrita"
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <strong>B</strong>
          </ToolbarButton>
          <ToolbarButton
            title="Cursiva"
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <em>I</em>
          </ToolbarButton>
          <span className="admin-wysiwyg-toolbar__sep" aria-hidden />
          <ToolbarButton
            title="Lista con viñetas"
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            • Lista
          </ToolbarButton>
          <ToolbarButton
            title="Lista numerada"
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            1. Lista
          </ToolbarButton>
          {isBlog ? (
            <>
              <span className="admin-wysiwyg-toolbar__sep" aria-hidden />
              <ToolbarButton
                title="Subtítulo"
                active={editor.isActive("heading", { level: 2 })}
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
              >
                H2
              </ToolbarButton>
              <ToolbarButton
                title="Subtítulo menor"
                active={editor.isActive("heading", { level: 3 })}
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
              >
                H3
              </ToolbarButton>
              <ToolbarButton
                title="Cita"
                active={editor.isActive("blockquote")}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
              >
                “
              </ToolbarButton>
            </>
          ) : null}
        </div>
        <EditorContent editor={editor} />
      </div>

      <input ref={hiddenRef} type="hidden" name={name} defaultValue={initialHtml} />
    </div>
  );
}
