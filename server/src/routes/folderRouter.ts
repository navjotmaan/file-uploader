import { createFolder, getAllFolders, editFolderName } from "../controllers/folderController.js";
import { deleteFoldersAndFiles } from "../controllers/fileController.js";
import { Router } from "express";

const folderRouter = Router();

folderRouter.post('/new', createFolder);
folderRouter.get('/all', getAllFolders);
folderRouter.delete('/delete', deleteFoldersAndFiles);
folderRouter.put('/:id', editFolderName);

export { folderRouter };