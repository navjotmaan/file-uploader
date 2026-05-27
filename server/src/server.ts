import express, { type Request, type Response } from 'express';
import expressSession from 'express-session';
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";  
import { PrismaClient } from "../generated/prisma/client";
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import passport from 'passport';

const app = express();

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

app.get('/', (req: Request, res: Response) => {
    res.send('hello');
});

app.listen(3000, () => {
    console.log(`server is running at port 3000`);
});