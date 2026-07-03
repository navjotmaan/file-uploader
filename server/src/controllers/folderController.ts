import type { NextFunction, Request, Response } from 'express'
import { prisma } from '../server.js';

async function createFolder(req: Request, res: Response, next: NextFunction) {
    try {
        const { folderName } = req.body;
        const userId = (req.user as any)?.id;

        const newFolder = await prisma.folder.create({
            data: {
                name: folderName,
                userId: userId,
            },
            include: {
                _count: {
                    select: { files: true },
                },
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
            },
            include: {
                _count: {
                    select: { files: true },
                }
            }
        });
        res.json(allFolder);
    } catch (err) {
        next(err);
    }
}

export { createFolder, getAllFolders };