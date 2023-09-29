import Joi from 'joi';
export const registerSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required().min(6).max(32),
  email: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
});
