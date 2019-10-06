module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgresql://postgres:B3Th3B3st@localhost/travelist",
  TEST_DATABASE_URL:
    process.env.TEST_DATABASE_URL ||
    "postgresql://postgres:B3Th3B3st@localhost/travelist_test",
  JWT_SECRET: process.env.JWT_SECRET || "chuck-norris",
  JWT_EXPIRY: process.env.JWT_EXPIRY || "20s"
};
