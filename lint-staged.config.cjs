module.exports = {
  '*.{ts,js,cjs,mjs}': [
    'eslint --fix --no-warn-ignored --max-warnings=0',
    'prettier --write',
  ],
  '*.{json,md,yml,yaml}': ['prettier --write'],
};
