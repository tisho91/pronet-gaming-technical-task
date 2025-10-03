import { flat } from "eslint-define-config";

export default flat([
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: ["dist/**", "node_modules/**"],
    languageOptions: {
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
      prettier: require("eslint-plugin-prettier"),
    },
    rules: {
      semi: ["error", "always"],
      quotes: ["error", "single"],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "prettier/prettier": ["error", { bracketSpacing: true }],
    },
    extends: ["plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
  },
]);
