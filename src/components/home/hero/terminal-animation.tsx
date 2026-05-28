"use client";

export function TerminalAnimation() {
  const terminalCode = `user@portfolio:~$ npm install andrewck24
user@portfolio:~$ cd andrewck24
user@portfolio:~/andrewck24$ npm run build
user@portfolio:~/andrewck24$ npm start

> Starting server...
> Server started at http://localhost:3000
> AT runtime, where our ideas execute`;

  return (
    <div
      data-testid="terminal-animation"
      className="border-border from-gradient-5/20 via-gradient-3/20 to-gradient-2/20 grid min-h-75 w-full overflow-hidden rounded-lg border bg-linear-to-r p-2 shadow-lg backdrop-blur-md lg:h-full lg:p-4"
    >
      <pre className="bg-background/65 overflow-x-auto rounded-md p-4 font-mono text-sm">
        <code>{terminalCode}</code>
      </pre>
    </div>
  );
}
