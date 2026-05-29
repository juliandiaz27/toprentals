export type PageFieldType =
  | "text"
  | "textarea"
  | "image"
  | "video"
  | "url"
  | "boolean";

export type PageField = {
  key: string;
  label: string;
  type: PageFieldType;
  section: string;
  hint?: string;
  fallback?: string;
  required?: boolean;
};

export type PageDefinition = {
  slug: string;
  title: string;
  publicPath: string;
  description?: string;
  fields: PageField[];
};

export type PageContent = Record<string, unknown>;
