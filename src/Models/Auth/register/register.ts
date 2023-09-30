import { Collection } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getUsersCollection } from '../../../DB/collections';
import { createUserPhotoDoc } from './createUserPhotoDoc';

const jwtSecret = process.env.JWT_SECRET;
let usersCollection: Collection;

const setUsersCollection = async () => {
  usersCollection = await getUsersCollection();
};
setUsersCollection();

interface Body {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
  zipCode: string;
}

export const register = async (body: Body) => {
  let { email, password, username, firstName, lastName, zipCode } = body;
  const displayUsername = username;
  username = username.toLowerCase();

  try {
    const userResult = await usersCollection.findOne({ username });
    if (userResult) {
      return {
        code: 400,
        data: `A user with the name ${username} already exists.`,
      };
    }
    const emailResult = await usersCollection.findOne({ email });
    if (emailResult) {
      return {
        code: 400,
        data: `A user with the email ${email} already exists.`,
      };
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    const payload = {
      username,
      displayUsername,
      email,
      password: encryptedPassword,
      firstName: `${firstName[0].toUpperCase()}${firstName.substring(1)}`,
      lastName: `${lastName[0].toUpperCase()}${lastName.substring(1)}`,
      zipCode,
    };
    const insertResult = await usersCollection.insertOne(payload);

    if (!insertResult.acknowledged) {
      return {
        code: 400,
        data: 'There was an error processing your registration request.',
      };
    }

    let token;

    if (typeof jwtSecret === 'string') {
      token = jwt.sign(
        {
          userId: insertResult.insertedId.toHexString(),
          username,
        },
        jwtSecret
      );
    }

    await createUserPhotoDoc(insertResult.insertedId, username, email);

    return {
      code: 201,
      data: {
        userId: insertResult.insertedId.toHexString(),
        username: displayUsername,
        firstName,
        lastName,
        zipCode,
        token,
      },
    };
  } catch (err) {
    return {
      code: 400,
      data: 'There was an error processing your registration request.',
    };
  }
};
