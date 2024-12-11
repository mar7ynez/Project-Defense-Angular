import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
    recipeTitle: {
        type: String,
        required: [true, 'Recipe title is required!'],
        minLength: [10, 'Recipe title length must be atleast 15 characters long!']
    },
    ingredients: [{
        ingredientName: {
            type: String,
            required: [true, 'Ingredient is required!'],
        },
        ingredientQuantity: {
            type: String,
            required: [true, 'Quantity is required!'],
        },
    }],
    image: {
        type: String,
        // required: [true, 'Image path is required!'],
        match: [/^https?:\/\//, 'Image path does not match the requirements!']
    },
    duration: {
        type: String,
        required: [true, 'Duration is required!'],
        minLength: [4, 'Duration length must be atleast 3 characters long!']
    },
    directions: {
        type: String,
        required: [true, 'Directions are required!'],
        minLength: [30, 'Directions length must be atleast 30 characters long!']
    },
    likes: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    _ownerId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
});

export const Recipe = mongoose.model('Recipe', recipeSchema);