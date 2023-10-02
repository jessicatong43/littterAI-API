import { registerController } from './register/register';
import { loginController } from './login/login';

export const Auth = {
  register: registerController,
  login: loginController,
};
