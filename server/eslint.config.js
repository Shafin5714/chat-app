import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  { languageOptions: { globals: { ...globals.node } } },
  pluginJs.configs.recommended,
  {
    rules: {
      'no-undef': 'warn',
      'no-unused-vars': 'warn',
    },
  },
];
