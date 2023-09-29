import { Collection } from 'mongodb';
import connectDb from './connectDB';

type CollectionNames = 'users' | 'userCategoryCount' | 'uploads';

const collections: Record<CollectionNames, Collection | null> = {
  users: null,
  userCategoryCount: null,
  uploads: null,
};

const getCollection = async (
  collectionName: CollectionNames
): Promise<Collection> => {
  if (collections[collectionName]) {
    return collections[collectionName]!;
  }

  try {
    const db = await connectDb();
    collections[collectionName] = db.collection(collectionName);
    return collections[collectionName]!;
  } catch (err) {
    console.error(`Could not connect to ${collectionName} collection:`, err);
    throw new Error('Database connection failed');
  }
};

export const getUsersCollection = () => getCollection('users');
export const getCatCountCollection = () => getCollection('userCategoryCount');
export const getInfoCollection = () => getCollection('uploads');
