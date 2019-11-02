process.env.NODE_ENV = "test";
process.env.JWT_SECRETS = "test-jwt-secret";

require("dotenv").config();

process.env.TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ||
  "postgresql://postgres:B3Th3B3st@localhost/travelist_test";
const { expect } = require("chai");
const supertest = require("supertest");

global.expect = expect;
global.supertest = supertest;
