import { MongoClient, Db } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.MONGO_DB || 'read_model';

let dbInstance: Db;

export async function initializeMongo(): Promise<Db> {
    if (!dbInstance) {
        const client = new MongoClient(MONGO_URI);
        await client.connect();
        dbInstance = client.db(DB_NAME);
        console.log("📦 MongoDB conectado:", DB_NAME);
    }
    return dbInstance;
}

export function getMongoDb(): Db {
    if (!dbInstance) {
        throw new Error("❌ MongoDB no inicializado. Llamá initializeMongo() antes.");
    }
    return dbInstance;
}
