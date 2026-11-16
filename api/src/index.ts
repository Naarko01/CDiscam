import { serve } from '@hono/node-server'
import app from './app'
import { env } from './config/env'
import { closeDb, connectDb } from './config/db'

await connectDb()
console.log('MongoDB connecté')

const server = serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.log(`API sur http://localhost:${info.port}/api`)
})

const shutdown = async () => {
  server.close()
  await closeDb()
  process.exit(0)
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
