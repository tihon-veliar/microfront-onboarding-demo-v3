import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Общие правила для repo, кроме Next app
  {
    files: ["apps/*/**/*.{ts,tsx}", "packages/*/**/*.{ts,tsx}"],
    ignores: ["apps/web/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": "warn",
    },
  },

  // Next config надо добавлять как массив на верхнем уровне
  ...nextVitals.map((config) => ({
    ...config,
    files: ["apps/frontend/**/*.{js,jsx,ts,tsx}"],
  })),

  ...nextTs.map((config) => ({
    ...config,
    files: ["apps/frontend/**/*.{js,jsx,ts,tsx}"],
  })),

  {
    ignores: ["**/.next/**", "**/dist/**", "**/build/**", "**/.turbo/**", "**/node_modules/**"],
  },
  prettier,
];
