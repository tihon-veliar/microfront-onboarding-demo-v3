import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["**/*.ts", "**/*.js"],
    languageOptions: {
      parserOptions: {
        project: true
      }
    },
    rules: {
      "no-console": "off", // в скриптах это нормально
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": "error"
    }
  },

  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**"
    ]
  }
]);