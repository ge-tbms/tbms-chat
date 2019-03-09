/* eslint quotes: off */

module.exports = {
  "ecmaFeatures": {
    "jsx": true,
    "modules": true,
  },
  "extends": "eslint:recommended",
  "env": {
    "browser": true,
    "node": true
  },
  "parser": "babel-eslint",
  "rules": {
    "quotes": [2, "single"],
    "strict": [2, "never"],
    "react/jsx-uses-react": 2,
    "react/jsx-uses-vars": 2,
    "no-unused-vars": [1, "never"]
  },
  "parserOptions": {
    "ecmaFeatures": {
      "legacyDecotators": true,
      "experimentalObjectRestSpread": true
    }
  },
  "plugins": [
    "react"
  ]
};