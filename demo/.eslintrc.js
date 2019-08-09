module.exports = {
	env:{ browser: true },
	extends: [
		"eslint:recommended",
		'plugin:@typescript-eslint/recommended',
		'plugin:react/recommended'
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'prettier'],
	settings: {
	  'import/parsers': {
		'@typescript-eslint/parser': ['.ts', '.tsx'],
	  },
	  'import/resolver': { 
		  typescript: {
              
          } 
		},
		'react': { 'version': 'detect' },
	},
	rules: {
		'brace-style': [2, 'allman', { "allowSingleLine": true }],
		'quotes': [2, 'single'],
		'react/prop-types': 0,
		'@typescript-eslint/explicit-function-return-type': [2, {allowExpressions: true,  "allowTypedFunctionExpressions": true}],
		"@typescript-eslint/no-use-before-define": [2, {"functions": false}],
	},
 };
