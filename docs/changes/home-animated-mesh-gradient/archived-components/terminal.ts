export type TerminalLine =
  | { type: "command"; path: string; cmd: string }
  | { type: "output"; text: string }
  | { type: "blank" }
  | { type: "ascii"; content: string }
  | { type: "final"; path: string };

export const terminalLines: TerminalLine[] = [
  { type: "command", path: "~/projects", cmd: "npm install andrewck24@latest" },
  { type: "output", text: "added andrewck24 in Taipei, Taiwan" },
  { type: "blank" },
  { type: "command", path: "~/projects", cmd: "npm start" },
  { type: "ascii", content: "andrewck24" },
  { type: "final", path: "~/projects" },
];
