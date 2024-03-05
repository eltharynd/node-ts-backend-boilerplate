import dotenv from 'dotenv'
dotenv.config()

export default {
  PRODUCTION: /true/i.test(process.env.production || process.env.PRODUCTION),
  DEBUGGING: /true/i.test(process.env.DEBUGGING || 'false'),
  TESTING:
    /test/i.test(process.env.NODE_ENV) || /true/i.test(process.env.TESTING),

  DOMAIN: process.env.DOMAIN || 'localhost',
  API_BASE: process.env.API_BASE || '/api/v1/',
  PORT: parseInt(process.env.PORT || '3000'),

  MONGO_ADDRESS: process.env.MONGO_ADDRESS || 'inmemory',
  MONGO_USER: process.env.MONGO_USER || 'mongouser',
  MONGO_PASSWORD: process.env.MONGO_PASSWORD || 'averysecurepassword',

  JWT_SECRET: process.env.JWT_SECRET || 'asamplejwtsecret',
}
