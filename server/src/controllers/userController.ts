import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../server';

async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        req.login(newUser, (err) => {
            if (err) return next(err);
            return res.status(201).json({ message: 'User registered and logged in', user: { email: newUser.email} });
        });
    } catch (err) {
        next(err);
    }
}

async function login(req: Request, res: Response) {
    res.json({ message: 'Logged in successfully', user: { email: (req.user as any).email } });
}

async function logout(req: Request, res: Response, next: NextFunction) {
    req.logout((err) => {
        if (err) return next(err);
        res.json({ message: "Logged out successfully" });
    });
}

function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.status(401).json({ error: "Unauthorized. Please log in" });
}

function checkUserAuth(req: Request, res: Response) {
    return res.json({ 
      authenticated: true, 
      user: { name: (req.user as any).name, email: (req.user as any).email, id: (req.user as any).id } 
    });
}

export { register, login, logout, ensureAuthenticated, checkUserAuth };