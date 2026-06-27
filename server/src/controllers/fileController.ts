import type { NextFunction, Request, Response } from 'express';
import { prisma } from '../server';
import { supabase } from '../../lib/supabase.js'; 

async function uploadFileController(req: Request, res: Response) {
  try {
    const file = req.file as Express.Multer.File; 
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // 1. Create a unique filename to prevent overwriting
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;

    // 2. Upload the file buffer to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('files_upload') // Your bucket name
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false, // Change to true if you want to overwrite files with the same name
      });

    if (uploadError) {
      throw uploadError;
    }

    // 3. Get the Public URL of the uploaded file
    const { data: urlData } = supabase.storage
      .from('files_upload')
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;

    const { folderId } = req.body;
    const userId = (req.user as any)?.id;

    // 4. Save the record in PostgreSQL using Prisma
    const newRecord = await prisma.file.create({
      data: {
        name: fileName || 'Untitled',
        userId: userId,
        folderId: folderId,
        url: publicUrl,
        size: file.size,
      },
    });

    return res.status(201).json({
      message: 'File uploaded and saved successfully!',
      data: newRecord,
    });

  } catch (error) {
    console.error('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
    
    return res.status(500).json({ error: errorMessage });
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

export { uploadFileController, getAllFiles };