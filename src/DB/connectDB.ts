import { MongoClient, Db } from 'mongodb';

// const USERNAME = encodeURIComponent(process.env.DB_USER);
// const PASSWORD = encodeURIComponent(process.env.DB_PASS);
const USERNAME = '';
const PASSWORD = '';
const HOST = process.env.DB_HOST || 'localhost';
const PORT = process.env.DB_PORT || '27017';
const DB_NAME = process.env.DB_NAME || 'litterAI';
const DB_AUTHCOLL = process.env.DB_AUTHCOLL || 'admin';
let URI: string;

if (USERNAME && PASSWORD) {
  URI = `mongodb://${USERNAME}:${PASSWORD}@${HOST}:${PORT}/?authMechanism=DEFAULT&authSource=${DB_AUTHCOLL}`;
} else {
  URI = 'mongodb://localhost:27017';
}

let db: Db;

const connectDb = async () => {
  if (db) {
    return db;
  } else {
    const client = await MongoClient.connect(URI);
    db = client.db(DB_NAME);
    return db;
  }
};

export default connectDb;
