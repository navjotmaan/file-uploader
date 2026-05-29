import { register, login, logout, ensureAuthenticated, checkUserAuth } from '../controllers/userController.js';
import { Router } from 'express';
const userRouter = Router();
import passport from 'passport';

userRouter.post('/register', register);
userRouter.post('/login', passport.authenticate('local'), login);
userRouter.post('/logout', logout);

userRouter.get('/api/me', ensureAuthenticated, checkUserAuth);

export { userRouter };