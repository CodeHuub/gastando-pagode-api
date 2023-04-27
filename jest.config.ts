import { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  coverageDirectory: "./coverage",
  testMatch: [
    "**/?(*.)+(test).ts"
  ],
  resetMocks: true,
  clearMocks: true,

  moduleNameMapper: {
    "@dal/(.*)": "<rootDir>/src/db/dal/$1",
    "@models/(.*)": "<rootDir>/src/db/models/$1",
    "@db/(.*)": "<rootDir>/src/db/$1",
    "@routes/(.*)": "<rootDir>/src/api/routes/$1",
    "@services/(.*)": "<rootDir>/src/api/services/$1",
    "@controllers/(.*)": "<rootDir>/src/api/controllers/$1",
    "@api/(.*)": "<rootDir>/src/api/$1",
    "@root/(.*)": "<rootDir>/src/$1"
  }

}

export default config;