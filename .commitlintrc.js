module.exports={
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [0, "always", 72],
    'header-case': [0, 'never'],
    'scope-case': [0, 'never'],
  }
};
// rules reference : https://commitlint.js.org/#/reference-rules
