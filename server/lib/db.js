import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer = null;

export async function connectDB() {
  let uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log('No MONGODB_URI — using in-memory database (local demo only)');
    memoryServer = await MongoMemoryServer.create();
    uri = memoryServer.getUri();
    process.env.MONGODB_URI = uri;
  }

  await mongoose.connect(uri);
  console.log('MongoDB connected');
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
}
