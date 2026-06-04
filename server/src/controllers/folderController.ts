import type { NextFunction, Request, Response } from 'express'
import { prisma } from '../server'

async function createFolder(req: Request, res: Response, next: NextFunction) {
    try {
        const { folderName, userId } = req.body;

        const newFolder = await prisma.folder.create({
            data: {
                name: folderName,
                userId: userId,
            },
        });

        return res.status(201).json(newFolder);
    } catch (err) {
        next(err);
    }
}

async function getAllFolders(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req.user as any)?.id;
        const allFolder = await prisma.folder.findMany({
            where: {
                userId: userId
            }
        });
        res.json(allFolder);
    } catch (err) {
        next(err);
    }
}

export { createFolder, getAllFolders };