import type { Config } from "@jest/types";
const { defaults } = require("jest-config");

const config: Config.InitialOptions = {
  verbose: true,
  setupFilesAfterEnv: ["./jest-setup.ts"],
  preset: "ts-jest",
  moduleFileExtensions: [
    ...defaults.moduleFileExtensions,
    "ts",
    "tsx",
    "js",
    "jsx",
  ],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!**/test/**",
    "!**/node_modules/**",
  ],
  testEnvironment: "jsdom",
};
export default config;
