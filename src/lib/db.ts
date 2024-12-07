import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env')
}

export async function connectDB() {
  try {
    console.log('Verbindung zur Datenbank wird hergestellt...')
    const opts = {
      bufferCommands: false,
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI, opts)
      console.log('Erfolgreich mit MongoDB verbunden!')
      console.log('Verbindungsstatus:', mongoose.connection.readyState)
    } else {
      console.log('Bereits mit MongoDB verbunden.')
      console.log('Verbindungsstatus:', mongoose.connection.readyState)
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    throw error
  }
}
