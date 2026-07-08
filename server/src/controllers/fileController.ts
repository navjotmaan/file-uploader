import type { NextFunction, Request, Response } from 'express';
import { prisma } from '../server.js';
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

    return res.status(201).json(newRecord);

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

async function deleteFile(req: Request, res: Response, next: NextFunction) {
  try {
    const { fileId } = req.body;  

    if (!fileId || typeof fileId !== 'string') {
      return res.status(400).json({ success: false, message: "Invalid or missing fileId." });
    }

    const bucketPathSegment = 'files_upload/';

    const file = await prisma.file.findUnique({
      where: { id: fileId } 
    });
    
    if (!file) {
      return res.status(404).json({ success: false, message: "File not found in database." });
    }

    const fileNameInBucket = file.url.split(bucketPathSegment)[1];

    if (!fileNameInBucket) {
      return res.status(400).json({ success: false, message: "Could not parse filename from storage URL." });
    }

    const { error } = await supabase
      .storage
      .from('files_upload')
      .remove([fileNameInBucket]); 

    if (error) {
      throw new Error(`Storage deletion failed: ${error.message}`);
    } 

    await prisma.file.delete({
      where: { id: fileId }
    });

    return res.status(200).json({ success: true, message: "File deleted successfully." });

  } catch (error) {
    next(error);
  }
}

async function deleteFoldersAndFiles(req: Request, res: Response, next: NextFunction) {
  try {
    const { folderId } = req.body;

    // 1. Fetch all files inside this folder
    const files = await prisma.file.findMany({
      where: { folderId: folderId },
      select: { url: true } 
    });

    if (files.length > 0) {
      const bucketPathSegment = 'files_upload/';
      
      // Map over ALL files to extract their storage paths
      const fileNamesInBucket: string[] = files
        .map(file => file.url.split(bucketPathSegment)[1])
        .filter(Boolean) as string[]; // Filters out any undefined/empty values just in case

      if (fileNamesInBucket.length > 0) {
        // 2. Delete ALL files from Supabase Storage at once
        const { data, error } = await supabase
          .storage
          .from('files_upload')
          .remove(fileNamesInBucket); // Passes the full array of paths

        if (error) {
          // If storage fails, we probably want to stop before deleting the DB records
          throw new Error(`Storage deletion failed: ${error.message}`);
        } 
      }
    }
    
    // 3. Delete the folder from the database (Cascades to File rows)
    await prisma.folder.delete({
      where: { id: folderId }
    });

    return res.status(200).json({ success: true, message: "Folder and all associated assets deleted successfully." });

  } catch (error) {
    next(error);
  }
}

export { uploadFileController, getAllFiles, deleteFile, deleteFoldersAndFiles };