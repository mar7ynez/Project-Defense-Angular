import { Recipe } from "../model/Recipe.js";

export const create = (recipeData) => Recipe.create(recipeData);
export const getAll = () => Recipe.find();
export const getMyRecipes = (userId) => Recipe.find({ _ownerId: userId });
export const getOne = (recipeId) => Recipe.findById(recipeId);
export const update = (recipeData, recipeId) => Recipe.findByIdAndUpdate(recipeId, recipeData, { new: true, runValidators: true });
export const del = (recipeId) => Recipe.findByIdAndDelete(recipeId);
export const like = async (recipeId, userId) => {
    const hasLiked = await Recipe.find({ _id: recipeId, likes: { $in: [userId] } });
    const isOwner = await Recipe.findOne({ _id: recipeId, _ownerId: userId });

    if (!userId) {
        return;
    }

    if (isOwner) {
        throw new Error('Failed to like recipe. Owners cannot like their recipes.');
    }

    if (hasLiked.length) {
        throw new Error('You have already liked this recipe.');
    }

    await Recipe.findByIdAndUpdate(recipeId, { $push: { likes: [userId] } })
}

export const mostLikedRecipes = () => Recipe.aggregate([
    {
        $addFields: {
            likesCount: { $size: '$likes' }
        }
    },
    {
        $sort: { likesCount: -1 }
    },
    {
        $limit: 5
    }
]);

export const search = (search) => Recipe.find({ recipeTitle: new RegExp(search, 'i') });