import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['node_modules', 'test-results', 'playwright-report', 'src/api/generated', '.auth'] },
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    // Architectural boundary: specs must use page objects, not raw selectors.
    files: ['tests/**/*.spec.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.property.name='locator'][callee.object.name='page']",
          message:
            'Raw page.locator() in specs is forbidden — add a locator to the relevant page object (src/pages/).',
        },
        {
          selector: "CallExpression[callee.property.name='waitForTimeout']",
          message: 'Hard sleeps are forbidden — use web-first assertions, expect.poll, or pollUntil.',
        },
      ],
    },
  },
);
