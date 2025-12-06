import js from "@eslint/js";
import typescript from "typescript-eslint";

export default [
  js.configs.recommended,
  ...typescript.configs.recommended,
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "public/**",
      ".vercel/**",
      "*.config.js",
      "*.config.mjs"
    ]
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "prefer-const": "warn",
      "no-console": ["warn", { "allow": ["warn", "error"] }]
    }
  }
];
