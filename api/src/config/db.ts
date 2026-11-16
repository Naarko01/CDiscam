import mongoose, { type Connection } from 'mongoose'
import { env } from './env'

export async function connectDb(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) return mongoose
  await mongoose.connect(env.MONGO_URI) // nom de la base pris dans MONGO_URI
  // TODO: création des index (texte sur products, unique sur users.email)
  return mongoose
}

export function getConnection(): Connection {
  if (mongoose.connection.readyState !== 1) {
    throw new Error('Connexion Mongoose non initialisée : appeler connectDb() avant')
  }
  return mongoose.connection
}

export async function closeDb(): Promise<void> {
  await mongoose.disconnect()
}
