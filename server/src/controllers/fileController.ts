import type { NextFunction, Request, Response } from 'express';
import { prisma } from '../server';

async function createFile(req: Request, res: Response, next: NextFunction) {
    try {
        const { fileName, folderId } = req.body;
        const userId = (req.user as any)?.id;

        const newFile = await prisma.file.create({
            data: {
                name: fileName,
                userId: userId,
                folderId: folderId,
            },
        });

        return res.status(201).json(newFile);
    } catch (err) {
        next(err);
    }
}

async function getAllFiles(req: Request, res: Response, next: NextFunction) {
    try {
        const folderId = req.params.id;

        const allFiles = await prisma.file.findMany({
            where: {
                folderId: folderId as string,
            }
        });
        res.json(allFiles);
    } catch (err) {
        next(err);
    }
}

export { createFile, getAllFiles };