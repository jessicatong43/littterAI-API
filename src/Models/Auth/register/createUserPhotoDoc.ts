import { Collection, ObjectId } from 'mongodb';
import { getCatCountCollection } from '../../../DB/collections';
import { logError } from '../../../Errors/logError';

let catCountCollection: Collection;

const setCatCountCollection = async () => {
  catCountCollection = await getCatCountCollection();
};
setCatCountCollection();

export const createUserPhotoDoc = async (
  userId: ObjectId,
  username: string,
  email: string
) => {
  try {
    const payload = {
      userId,
      email,
      username,
      pictureData: {
        paper: 0,
        cardboard: 0,
        compost: 0,
        metal: 0,
        glass: 0,
        plastic: 0,
        trash: 0,
        other: 0,
        unknown: 0,
      },
      totalUploads: 0,
    };

    catCountCollection.insertOne(payload);
  } catch (err: any) {
    await logError(err, 'An error occured while executing createUserPhotoDoc');
    console.log(err);
  }
};
