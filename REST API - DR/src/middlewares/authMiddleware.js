import * as jwt from '../lib/jwt.js';
import * as recipeService from '../services/recipeService.js';

export const auth = async (req, res, next) => {
    const token = req.cookies['auth'];


    if (!token) {
        return next();
    }

    try {
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

        req.user = decodedToken;

        next();
    } catch (error) {
        res.clearCookie('auth');

        next()
    }
}

export const isOwner = async (req, res, next) => {
    try {
        const recipe = await recipeService.getOne(req.params.recipeId);

        if (!recipe) {
            return res.status(404).json({ error: 'Product not found. The product with the specified ID does not exist.' });
        }

        if (recipe._ownerId != req.user._id) {
            return res.status(403).json({ error: 'Unauthorized action. You must be the owner of this product to perform this action.' });
        }

        next();
    }
    catch (error) {
        console.log('Handle owner check Error!\n', error);
        return res.status(500).json({ error: 'An unexpected error occurred while verifying ownership. Please try again later.' });
    }
}

export const isAuth = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized: User not logged in.' });
    }

    next();
}