const path = require("path");
const { register } = require("tsconfig-paths");

register({
  baseUrl: __dirname,
  paths: {
    "@/*": ["dist/src/*"],
    "generated/*": ["dist/generated/*"],
  },
});