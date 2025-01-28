// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ["expo", "prettier"],
  plugins: ["prettier"],
  ignorePatterns: ["/dist/*"],
  env: {
    node: true,
  },
  rules: {
    "prettier/prettier": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-require-imports": "warn",
  },
};
