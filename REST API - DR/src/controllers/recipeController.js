import { Router } from 'express';
import * as recipeService from '../services/recipeService.js';
import { storage } from '../helpers/storage.js';
import { isAuth, isOwner } from '../middlewares/authMiddleware.js';

const recipeController = Router();

recipeController.get('/my-recipes', isAuth, async (req, res) => {
    const userId = req.user?._id;
    try {
        const recipes = await recipeService.getMyRecipes(userId);
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user recipes. Please try again later.' });
    }
});

recipeController.get('/search', async (req, res) => {
    const searchTerm = req.query.search;
    try {
        const recipes = await recipeService.search(searchTerm);
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search recipes. Please try again later.' });
    }
});

recipeController.get('/mostLiked', async (req, res) => {
    try {
        const mostLikedRecipes = await recipeService.mostLikedRecipes();
        res.status(200).json(mostLikedRecipes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch the most liked recipes. Please try again later.' });
    }
});

recipeController.post('/', storage, isAuth, async (req, res) => {
    try {
        const imagePath = req.file ? `http://localhost:3000/images/${req.file.filename}` : null;
        const recipeData = {
            recipeTitle: req.body.recipeTitle,
            ingredients: JSON.parse(req.body.ingredients),
            image: imagePath,
            duration: req.body.duration,
            directions: req.body.directions,
            _ownerId: req.user._id
        };

        if (!imagePath) {
            throw new Error();
        }

        await recipeService.create(recipeData);
        res.status(201).json({ message: 'Recipe created successfully.' });
    } catch (error) {
        res.status(400).json({ error: 'Failed to create recipe. Please check your input and try again.' });
    }
});

recipeController.get('/', async (req, res) => {
    try {
        const recipes = await recipeService.getAll();
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recipes. Please try again later.' });
    }
});

recipeController.get('/:recipeId', async (req, res) => {
    const { recipeId } = req.params;
    try {
        const recipe = await recipeService.getOne(recipeId);
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found.' });
        }
        res.status(200).json(recipe);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recipe details. Please try again later.' });
    }
});

recipeController.put('/:recipeId', storage, isAuth, isOwner, async (req, res) => {
    const { recipeId } = req.params;
    try {
        const imagePath = req.file ? `http://localhost:3000/images/${req.file.filename}` : undefined;
        const recipeData = {
            recipeTitle: req.body.recipeTitle,
            ingredients: JSON.parse(req.body.ingredients),
            duration: req.body.duration,
            directions: req.body.directions,
            _ownerId: req.user._id
        };

        if (imagePath) {
            recipeData.image = imagePath;
        }

        const updatedRecipe = await recipeService.update(recipeData, recipeId);

        if (!updatedRecipe) {
            return res.status(404).json({ error: 'Recipe not found or could not be updated.' });
        }

        res.status(200).json({ message: 'Recipe updated successfully.' });
    } catch (error) {
        res.status(400).json({ error: 'Failed to update recipe. Please check your input and try again.' });
    }
});

recipeController.delete('/:recipeId', isAuth, isOwner, async (req, res) => {
    const { recipeId } = req.params;
    try {
        const success = await recipeService.del(recipeId);
        if (!success) {
            return res.status(404).json({ error: 'Recipe not found or could not be deleted.' });
        }
        res.status(200).json({ message: 'Recipe deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete recipe. Please try again later.' });
    }
});

recipeController.get('/:recipeId/likes', isAuth, async (req, res) => {
    const { recipeId } = req.params;
    try {
        await recipeService.like(recipeId, req.user._id);

        res.status(200).json({ message: 'Recipe liked successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Failed to like recipe. Please try again later.' });
    }
});

export { recipeController };
