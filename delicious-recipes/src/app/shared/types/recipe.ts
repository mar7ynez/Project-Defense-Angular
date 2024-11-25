import { ingredients } from "./ingredient"

export type Recipe = {
    _id?: string,
    recipeTitle: string,
    ingredients: ingredients[],
    imageUrl: string,
    duration: string,
    directions: string,
    likes: string[]
}