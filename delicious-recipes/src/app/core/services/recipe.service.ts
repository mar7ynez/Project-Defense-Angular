import { HttpClient, HttpParams } from "@angular/common/http";
import { endpoints, host } from "../../../environments/environment";
import { Injectable } from "@angular/core";
import { Recipe } from "../../shared/types/recipe";

@Injectable({
    providedIn: 'root'
})

export class CatalogService {
    constructor(private http: HttpClient) { }

    getRecipes() {
        return this.http.get<Recipe[]>(`${host}${endpoints.getAllRecipes}`);
    }

    getOne(recipeId: string) {
        return this.http.get<Recipe>(`${host}${endpoints.getOneRecipe(recipeId)}`);
    }

    edit(updatedRecipe: Recipe, recipeId: string) {
        const formData = new FormData();

        formData.append('recipeTitle', updatedRecipe.recipeTitle);
        formData.append('ingredients', JSON.stringify(updatedRecipe.ingredients));
        formData.append('image', updatedRecipe.image);
        formData.append('duration', updatedRecipe.duration);
        formData.append('directions', updatedRecipe.directions);

        return this.http.put<Recipe>(`${host}${endpoints.getOneRecipe(recipeId)}`, formData);
    }

    create(recipeData: Recipe) {
        const formData = new FormData();

        formData.append('recipeTitle', recipeData.recipeTitle);
        formData.append('ingredients', JSON.stringify(recipeData.ingredients));
        formData.append('image', recipeData.image);
        formData.append('duration', recipeData.duration);
        formData.append('directions', recipeData.directions);

        return this.http.post<Recipe>(`${host}${endpoints.getAllRecipes}`, formData);
    }

    del(recipeId: string) {
        return this.http.delete(`${host}${endpoints.getOneRecipe(recipeId)}`);
    }

    like(recipeId: string) {
        return this.http.get(`${host}${endpoints.likeRecipe(recipeId)}`);
    }

    getMostLiked() {
        return this.http.get<Recipe[]>(`${host}${endpoints.getMostLiked}`);
    }

    search(searchQuery: string) {
        const search = new HttpParams().set('search', searchQuery)

        return this.http.get<Recipe[]>(`${host}${endpoints.search}`, { params: search });
    }

    getMyRecipes() {
        return this.http.get<Recipe[]>(`${host}${endpoints.myRecipes}`)
    }
}