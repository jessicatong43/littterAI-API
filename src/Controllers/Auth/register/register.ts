import { Request, Response } from 'express';
import { loginSchema } from './bodySchema';

export const registerController = async (req: Request, res: Response) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    res.status(400).send({ message: error.details[0].message });
    return;
  }
  try {
    res.send('Check!');
  } catch (error) {}
};
