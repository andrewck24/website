const BASE_URL = "https://andrewck24.vercel.app";

export interface LlmsItem {
  title: string;
  slug: string;
  description?: string;
}

export function buildLlmsBody(notes: LlmsItem[], projects: LlmsItem[]): string {
  const noteLines = notes
    .map(
      (note) =>
        `- [${note.title}](${BASE_URL}/en/notes/${note.slug})${note.description ? `: ${note.description}` : ""}`
    )
    .join("\n");

  const projectLines = projects
    .map(
      (project) =>
        `- [${project.title}](${BASE_URL}/en/projects/${project.slug})${project.description ? `: ${project.description}` : ""}`
    )
    .join("\n");

  return `# Andrew Tseng

Software Engineer specialising in React, Node.js, and modern web technologies.

## Notes

${noteLines}

## Projects

${projectLines}
`;
}
