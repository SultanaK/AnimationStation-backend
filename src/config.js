
module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL: process.env.DB_URL || 'postgresql://postgres@localhost/animation-station',
  TEST_DB_URL: process.env.TEST_DB_URL || 'postgresql://postgres@localhost/animation-station-test',
  JWT_SECRET: process.env.JWT_SECRET || 'use-env-secret',
}
