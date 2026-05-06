import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import firebaseRulesPlugin from '@firebase/eslint-plugin-security-rules';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['dist/**/*']
  },
  {
    files: ['**/*.rules'],
    plugins: {
      'firebase-security-rules': firebaseRulesPlugin
    },
    ...firebaseRulesPlugin.configs['flat/recommended']
  }
);
