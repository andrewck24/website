"use client";

import { useEffect, useRef, useState } from "react";
import { GeistPixelSquare } from "geist/font/pixel";
import { terminalLines } from "@/lib/data/terminal";

const steps = terminalLines;

export function TerminalAnimation() {
  const [cursor, setCursor] = useState(0);
  const [typingIndex, setTypingIndex] = useState(-1);
  const [typedText, setTypedText] = useState("");
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
      index: number,
      text: string,
      onDone: () => void,
      startAt: number
    ) => {
      let i = 0;
      after(() => {
        setTypingIndex(index);
        setTypedText("");
        const id = setInterval(() => {
          if (stopped.current) {
            clearInterval(id);
            return;
          }
          i++;
          setTypedText(text.slice(0, i));
          if (i >= text.length) {
            clearInterval(id);
            onDone();
          }
        }, 40);
        intervalIds.current.push(id);
      }, startAt);
    };

    const cmd0 = steps[0] as { type: "command"; path: string; cmd: string };
    const cmd1 = steps[3] as { type: "command"; path: string; cmd: string };

    // 1. Reveal command 0's line
    after(() => setCursor(1), 0);

    // 2. Typewriter for command 0; on done, reveal output+blank, then command 1's
    //    line, then typewriter for command 1; on done, reveal ASCII art, final
    //    prompt, and start the cursor blink
    typewrite(
      0,
      cmd0.cmd,
      () => {
        after(() => setCursor(3), 40);
        after(() => setCursor(4), 280);
        typewrite(
          3,
          cmd1.cmd,
          () => {
            after(() => setCursor(5), 0);
            after(() => setCursor(6), 500);
            after(() => setCursorShown(true), 700);
          },
          700
        );
      },
      700
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
      className="border-border bg-background/65 grid min-h-75 w-full overflow-hidden rounded-lg border p-4 shadow-lg backdrop-blur-md md:h-full"
    >
      <pre className="overflow-x-auto font-mono text-sm">
        <div className="mb-3 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="bg-muted-foreground/40 size-2.5 rounded-full"
            />
          ))}
        </div>
        <code className="flex flex-col gap-0.5">
          {steps.map((step, i) => {
            const shown = cursor > i;
            switch (step.type) {
              case "command": {
                const text =
                  typingIndex === i
                    ? typedText
                    : typingIndex > i
                      ? step.cmd
                      : "";
                return (
                  <span
                    key={i}
                    data-terminal-line=""
                    data-shown={shown || undefined}
                  >
                    <span className="text-muted-foreground">
                      {step.path} ${" "}
                    </span>
                    <span>{text}</span>
                  </span>
                );
              }
              case "output":
                return (
                  <span
                    key={i}
                    data-terminal-line=""
                    data-shown={shown || undefined}
                  >
                    {step.text}
                  </span>
                );
              case "blank":
                return shown ? <span key={i}>&nbsp;</span> : null;
              case "ascii":
                return (
                  <span
                    key={i}
                    className={`${GeistPixelSquare.className} mt-1 block`}
                    style={{
                      fontSize: "clamp(24px, 4vw, 56px)",
                      opacity: shown ? 1 : 0,
                      transition: "opacity 500ms ease",
                      lineHeight: 1.1,
                    }}
                  >
                    {step.content}
                  </span>
                );
              case "final":
                return shown ? (
                  <span key={i}>
                    <span className="text-muted-foreground">
                      {step.path} ${" "}
                    </span>
                    {cursorShown && <span className="animate-blink">▋</span>}
                  </span>
                ) : null;
              default:
                return step satisfies never;
            }
          })}
        </code>
      </pre>
    </div>
  );
}
