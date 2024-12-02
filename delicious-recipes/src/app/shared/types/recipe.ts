import { ingredients } from "./ingredient"

export interface Recipe {
    _id?: string,
    recipeTitle: string,
    ingredients: ingredients[],
    imageUrl: string,
    duration: string,
    directions: string,
    likes: string[],
    likesCount?: number,
    _ownerId?: string
}