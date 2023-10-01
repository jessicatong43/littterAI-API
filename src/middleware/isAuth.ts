import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Joi from 'joi';

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
    if (!authHeader) {
      res.status(400).send({
        message:
          'An authorization token must be included to access this endpoint',
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      res
        .status(400)
        .send({ message: 'Authorization header format incorrect' });
      return;
    }

    const { error } = authTokenSchema.validate(authHeader);
    if (error) {
      res
        .status(400)
        .send({ message: "Authorization header must begin with 'Bearer'" });
      return;
    }

    const decodedToken = jwt.verify(token, jwtSecret) as jwt.JwtPayload;

    if (!decodedToken) {
      res.status(401).send({ message: 'Unauthorized' });
      return;
    }

    req.user = decodedToken;
    next();
  } catch (error: any) {
    res.status(401).send({ message: 'Unauthorized' });
    return;
  }
};

export default isAuth;
