import 'dotenv/config';
import { Collection } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getUsersCollection } from "../../../DB/collections";

let usersCollection: Collection;
const jwtSecret: string | undefined = process.env.JWT_SECRET;

const setUsersCollection = async () => {
  usersCollection = await getUsersCollection();
};
setUsersCollection();

interface Body {
  username: string,
	password: string,
}

export const login = async (body: Body) => {
  try {
    const { username, password } = body;

    const userData = await usersCollection.findOne({ username: username });
    if (!userData) {
      return { code: 401, data: 'Incorrect username/password'};
    }

    const validPass = await bcrypt.compare(password, userData.password);;
    if (!validPass) {
      return { code: 401, data: 'Incorrect username/password'};
    }

    let token = jwt.sign(
      {
        userId: userData._id.toHexString(),
        username,
      },
      `${jwtSecret}`
    );
    userData.password = token;

    return {
      code: 200,
      data: {
        username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        token
      }
    };

  } catch (err) {
    return { code: 404, data: 'There was an error processing your login request. Please try again.'}
  }
}
