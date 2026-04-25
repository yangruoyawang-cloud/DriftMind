import js from "@eslint/js";
import firebaseRulesPlugin from "@firebase/eslint-plugin-security-rules";

export default [
  {
    ignores: ["dist/**/*", "node_modules/**/*"]
  },
  js.configs.recommended,
  {
    files: ["**/*.rules"],
    plugins: {
      "firebase-rules": firebaseRulesPlugin
    },
    // We can add specific rules if needed, or use the recommended ones
  },
  ...firebaseRulesPlugin.configs["flat/recommended"]
];
