import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Joi from 'joi';

import { logError } from '../Errors/logError';

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error('jwtSecret must be defined');
}

interface RequestWithUser extends Request {
  user?: jwt.JwtPayload;
}

const isAuth = (req: RequestWithUser, res: Response, next: NextFunction) => {
  const authTokenSchema = Joi.string().pattern(/^Bearer /);

  try {
    const authHeader = req.get('Authorization');
    let token;
    // Authorization header validation
    if (!authHeader) {
      res.status(400).send({
        message:
          'An authorization token must be included to access this endpoint',
      });
      return;
    } else {
      token = authHeader.split(' ')[1];
      if (!token) {
        res
          .status(400)
          .send({ message: 'Authorization header format incorrect' });
      } else {
        const { error } = authTokenSchema.validate(authHeader);
        if (error) {
          res
            .status(400)
            .send({ message: "Authorization header must begin with 'Bearer'" });
          return;
        }
      }
    }
    if (req.user) {
      res.status(400).send('Error authorizing request');
    }

    // JWT validation
    let decodedToken;
    if (jwtSecret) {
      decodedToken = jwt.verify(token, jwtSecret) as jwt.JwtPayload;
      if (decodedToken) {
        req.user = decodedToken;
      } else {
        res.status(401).json({ msg: 'Unauthorized' });
      }
    }
  } catch (error: any) {
    logError(error, 'An error occured during isAuth');
  }
  next();
};

export default isAuth;
