import { Request, Response } from 'express';
import { registerSchema } from './bodySchema';
import { logError } from '../../../Errors/logError';
import Models from '../../../Models';

export const registerController = async (req: Request, res: Response) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    res.status(400).send({ message: error.details[0].message });
    return;
  }
  try {
    const { code, data } = await Models.authModels.register(req.body);
    res.status(code).send(data);
  } catch (error: any) {
    await logError(
      error,
      'An error occured while executing register controller'
    );
  }
};
