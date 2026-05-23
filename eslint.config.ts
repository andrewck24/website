import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tailwind from "eslint-plugin-better-tailwindcss";
import { defineConfig } from "eslint/config";

const eslintConfig = defineConfig([
  // Global ignores (only essential ones)
  {
    ignores: [
      ".next/**",
      "docs/**",
      "node_modules/**",
      "next-env.d.ts", // Next.js TypeScript environment file
      "jest.setup.ts", // Jest setup file
    ],
  },

  // Extend Next.js configs
  ...nextVitals,
  ...nextTs,

  // Tailwind CSS class validation (v4 support)
  tailwind.configs.recommended,
  {
    settings: {
      "better-tailwindcss": {
        entryPoint: "src/app/globals.css",
        ignore: [
          "gradients-container",
          "animate-first",
          "animate-second",
          "animate-third",
          "animate-fourth",
          "animate-fifth",
          "not-prose",
        ],
      },
    },
    rules: {
      "better-tailwindcss/enforce-consistent-line-wrapping": "off",
    },
  },
  {
    files: ["**/__tests__/**", "**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"],
    rules: {
      "better-tailwindcss/no-unknown-classes": "off",
    },
  },

  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          // 允許忽略：
          //   - 僅由底線組成的變數名（_、__、___）
          //   - 以「單一底線開頭」的變數名（_foo）
          // 避免過度寬鬆（如 __foo、_importantValue）
          argsIgnorePattern: "^(_+$|_[^_])",
          varsIgnorePattern: "^(_+$|_[^_])",
          // "caughtErrorsIgnorePattern": "^_", // 可視需要啟用
        },
      ],
    },
  },
]);

export default eslintConfig;
