// tests/unit/connectDb.test.ts

import { MongoClient, Db } from 'mongodb';
import connectDb from '../../../src/DB/connectDB';

// Mocking MongoClient.connect method
jest.mock('mongodb', () => {
  const mClient = {
    db: jest.fn().mockReturnThis(),
  };
  return {
    MongoClient: {
      connect: jest.fn().mockResolvedValue(mClient),
    },
  };
});

describe('connectDb', () => {
  it('should connect to the database if db is not already connected', async () => {
    const db = await connectDb();

    expect(MongoClient.connect).toBeCalled();
    expect(db).toBeDefined();
  });

  it('should return the existing db connection if already connected', async () => {
    const firstDb = await connectDb();
    const secondDb = await connectDb();

    expect(firstDb).toBe(secondDb);
  });
});
