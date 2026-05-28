import { register, login, logout } from '../controllers/userController.js';
import { Router } from 'express';
const userRouter = Router();
import passport from 'passport';

userRouter.post('/register', register);
userRouter.post('/login', passport.authenticate('local'), login);
userRouter.post('/logout', logout);

export { userRouter };