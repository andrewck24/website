"use client";

import { useEffect, useRef, useState } from "react";
import { terminalLines } from "@/lib/data/terminal";

const cmd0 = terminalLines[0] as { type: "command"; path: string; cmd: string };
const line1 = terminalLines[1] as { type: "output"; text: string };
const cmd1 = terminalLines[3] as { type: "command"; path: string; cmd: string };
const ascii = terminalLines[4] as { type: "ascii"; content: string };
const final = terminalLines[5] as { type: "final"; path: string };

export function TerminalAnimation() {
  const [path0Shown, setPath0Shown] = useState(false);
  const [cmd0Text, setCmd0Text] = useState("");
  const [outputShown, setOutputShown] = useState(false);
  const [path1Shown, setPath1Shown] = useState(false);
  const [cmd1Text, setCmd1Text] = useState("");
  const [asciiShown, setAsciiShown] = useState(false);
  const [finalShown, setFinalShown] = useState(false);
  const [cursorShown, setCursorShown] = useState(false);

  const stopped = useRef(false);
  const timeoutIds = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalIds = useRef<ReturnType<typeof setInterval>[]>([]);

  useEffect(() => {
    stopped.current = false;

    const after = (fn: () => void, ms: number) => {
      const id = setTimeout(() => {
        if (!stopped.current) fn();
      }, ms);
      timeoutIds.current.push(id);
    };

    const typewrite = (
      text: string,
      onChar: (s: string) => void,
      onDone: () => void,
      startAt: number
    ) => {
      let i = 0;
      after(() => {
        const id = setInterval(() => {
          if (stopped.current) {
            clearInterval(id);
            return;
          }
          i++;
          onChar(text.slice(0, i));
          if (i >= text.length) {
            clearInterval(id);
            onDone();
          }
        }, 40);
        intervalIds.current.push(id);
      }, startAt);
    };

    let t = 0;

    // 1. Reveal path for command 0
    after(() => setPath0Shown(true), t);
    t += 700;

    // 2. Typewriter for command 0; on done, reveal output
    typewrite(
      cmd0.cmd,
      (s) => setCmd0Text(s),
      () => {
        after(() => setOutputShown(true), 40);
        // 3. After output settles, reveal path for command 1
        after(() => setPath1Shown(true), 280);
        // 4. Typewriter for command 1; on done, fade-in ASCII + cursor
        typewrite(
          cmd1.cmd,
          (s) => setCmd1Text(s),
          () => {
            after(() => setAsciiShown(true), 0);
            after(() => setFinalShown(true), 500);
            after(() => setCursorShown(true), 700);
          },
          700
        );
      },
      t
    );

    return () => {
      stopped.current = true;
      timeoutIds.current.forEach(clearTimeout);
      intervalIds.current.forEach(clearInterval);
      timeoutIds.current = [];
      intervalIds.current = [];
    };
  }, []);

  return (
    <div
      data-testid="terminal-animation"
      className="border-border from-alt-grad-dev-s/20 via-alt-grad-prev-s/20 to-alt-grad-ship-s/20 grid min-h-75 w-full overflow-hidden rounded-lg border bg-linear-to-r p-2 shadow-lg backdrop-blur-md md:h-full md:p-4"
    >
      <pre className="bg-background/65 overflow-x-auto rounded-md p-4 font-mono text-sm">
        <code className="flex flex-col gap-0.5">
          {/* Command 0: npm install */}
          <span data-terminal-line="" data-shown={path0Shown || undefined}>
            <span className="text-muted-foreground">{cmd0.path} $</span>{" "}
            <span>{cmd0Text}</span>
          </span>
          {/* Output line */}
          <span data-terminal-line="" data-shown={outputShown || undefined}>
            {line1.text}
          </span>
          {/* Blank line */}
          {outputShown && <span>&nbsp;</span>}
          {/* Command 1: npm start */}
          <span data-terminal-line="" data-shown={path1Shown || undefined}>
            <span className="text-muted-foreground">{cmd1.path} $</span>{" "}
            <span>{cmd1Text}</span>
          </span>
          {/* ASCII art */}
          <span
            className="mt-1 block font-mono"
            style={{
              fontSize: "clamp(24px, 4vw, 56px)",
              opacity: asciiShown ? 1 : 0,
              transition: "opacity 500ms ease",
              lineHeight: 1.1,
            }}
          >
            {ascii.content}
          </span>
          {/* Final path + cursor */}
          {finalShown && (
            <span>
              <span className="text-muted-foreground">{final.path} $</span>{" "}
              {cursorShown && <span className="animate-blink">▋</span>}
            </span>
          )}
        </code>
      </pre>
    </div>
  );
}
