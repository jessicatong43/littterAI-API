import express from 'express';
import Contollers from '../Controllers';

export const authRouter = express.Router();

authRouter.post('/login', Contollers.Auth.register);
export default authRouter;
