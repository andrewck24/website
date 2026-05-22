import type { PortableTextComponents } from "@portabletext/react";
import { codeToHtml } from "shiki";
import Link from "next/link";

interface CodeBlockValue {
  _type: "code";
  language?: string;
  code: string;
  filename?: string;
}

interface CardBlockValue {
  _type: "card";
  title: string;
  href: string;
}

async function CodeBlock({ value }: { value: CodeBlockValue }) {
  const lang = value.language || "plaintext";
  const html = await codeToHtml(value.code ?? "", {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });
  return (
    <div
      className="not-prose my-4 overflow-x-auto rounded-lg text-sm"
      // shiki outputs inline styles for themes when defaultColor: false
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function CardBlock({ value }: { value: CardBlockValue }) {
  return (
    <Link
      href={value.href}
      target="_blank"
      rel="noopener noreferrer"
      className="not-prose border-border bg-card hover:bg-accent my-4 flex items-center gap-3 rounded-lg border p-4 transition-colors"
    >
      <div>
        <p className="text-foreground font-medium">{value.title}</p>
        <p className="text-muted-foreground mt-0.5 truncate text-xs">
          {value.href}
        </p>
      </div>
    </Link>
  );
}

export const portableTextComponents: PortableTextComponents = {
  types: {
    code: ({ value }: { value: CodeBlockValue }) => <CodeBlock value={value} />,
    card: ({ value }: { value: CardBlockValue }) => <CardBlock value={value} />,
  },
  marks: {
    link: ({ value, children }) =>
      value?.href ? (
        <a href={value.href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ) : (
        <>{children}</>
      ),
  },
};
