import Joi from 'joi';
export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required().min(6).max(32),
});
