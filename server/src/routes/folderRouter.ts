import { createFolder } from "../controllers/folderController";
import { Router } from "express";

const folderRouter = Router();

folderRouter.post('/folder', createFolder);

export { folderRouter };