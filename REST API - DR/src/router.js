import { Router } from 'express';
import { userController } from './controllers/userController.js';
import { recipeController } from './controllers/recipeController.js';

const router = Router();

router.use('/user', userController);
router.use('/recipes', recipeController);

export { router };