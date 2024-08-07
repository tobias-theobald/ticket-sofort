module.exports = {
  "extends": ["@resolution/eslint-config/profile/react"],
  "parserOptions": {
    "project": __dirname + '/tsconfig.json',
    "tsconfigRootDir": __dirname,
  },
  "ignorePatterns": ["expo-env.d.ts"],
  "root": true
}