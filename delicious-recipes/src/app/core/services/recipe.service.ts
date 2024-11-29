import { HttpClient } from "@angular/common/http";
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
        return this.http.put<Recipe>(`${host}${endpoints.getOneRecipe(recipeId)}`, updatedRecipe);
    }

    create(recipeData: Recipe) {
        return this.http.post<Recipe>(`${host}${endpoints.getAllRecipes}`, recipeData);
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
}