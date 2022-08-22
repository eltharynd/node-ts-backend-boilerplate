import * as dotenv from 'dotenv'
dotenv.config()

export default {
  production: process.env.production === 'true',
  test: process.env.NODE_ENV === 'test' || false,
  PORT: parseInt(process.env.PORT || '3000'),
  domain: process.env.domain || 'localhost',
  apiBase: process.env.apiBase || '/api/v1/',
  mongoConnectionString: process.env.mongoConnectionString || 'inmemory',
  jwtSecret: process.env.jwtSecret || 'asamplejwtsecret',
  stripeAPIKey: process.env.stripeAPIKey,
}
