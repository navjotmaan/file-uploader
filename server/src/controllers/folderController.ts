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
        
        console.log('Folder created successfully:', newFolder);
        return newFolder;
    } catch (err) {
        next(err);
    }
}

export { createFolder };