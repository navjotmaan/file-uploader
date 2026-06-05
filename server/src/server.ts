import express, { type Request, type Response } from 'express';
import expressSession from 'express-session';
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";  
import { PrismaClient } from "../generated/prisma/client";
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import passport from 'passport';
import './config/passport';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true                
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

app.use(
  expressSession({
    secret: process.env.SESSION_SECRET || 'a santa at nasa', 
    resave: false, 
    saveUninitialized: false, 
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
    },
    store: new PrismaSessionStore(
      prisma,
      {
        checkPeriod: 2 * 60 * 1000, // 2 minutes in ms
      }
    )
  })
);

app.use(passport.initialize());
app.use(passport.session());

import { userRouter } from './routes/userRouter.js';
import { folderRouter } from './routes/folderRouter';
import { fileRouter } from './routes/fileRouter';

app.use('/', userRouter);
app.use('/folder', folderRouter);
app.use('/file', fileRouter);

app.use((err: Error, req: Request, res: Response, next: Function) => {
  const status = (err as any).status || 500;

  console.error(`[Error] ${err.message}`);

  res.status(status).json({ 
    success: false,
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack 
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Server is running at port ${PORT}`);
});

export { prisma };