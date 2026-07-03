import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import type { User as PrismaUser } from "../../generated/prisma/client.js";
import { prisma } from "../server.js";
import bcrypt from 'bcryptjs';

passport.use(
  new LocalStrategy(
    { usernameField: 'email' }, // Using email instead of username
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { email } });
        
        if (!user) {
          return done(null, false, { message: 'Incorrect email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect email or password.' });
        }

        return done(null, user); 
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Determines which data of the user object should be stored in the session (just the ID)
passport.serializeUser((user: any, done) => {
  done(null, (user as PrismaUser).id);
});

// Fetches the full user object from the DB using the ID stored in the session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user); 
  } catch (err) {
    done(err);
  }
});