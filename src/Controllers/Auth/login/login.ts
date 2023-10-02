import Joi from 'joi';
import { Request, Response } from "express";
import Models from "../../../Models";

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

export const loginController = async (req: Request, res: Response) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    res.status(401).send({ message: error.details[0].message });
  }
  try {
    const { code, data } = await Models.authModels.login(req.body);
    res.status(code).send(data);
  } catch (err) {
    res.status(401).send('Username and password combination incorrect. Please try again.')
  }
}