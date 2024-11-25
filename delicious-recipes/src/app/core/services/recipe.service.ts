import { HttpClient } from "@angular/common/http";
import { api, host } from "../../../environments/environment";
import { Injectable } from "@angular/core";
import { Recipe } from "../../shared/types/recipe";

@Injectable()

export class CatalogService {
    constructor(private http: HttpClient) { }

    getRecipes() {
        return this.http.get<Recipe[]>(`${host}${api.getAll}`);
    }

    getOne(recipeId: string) {
        return this.http.get<Recipe>(`${host}${api.getOne(recipeId)}`);
    }

    edit(updatedRecipe: Recipe, recipeId: string) {
        return this.http.put<Recipe>(`${host}${api.getOne(recipeId)}`, updatedRecipe);
    }

    create(recipeData: Recipe) {
        return this.http.post<Recipe>(`${host}${api.getAll}`, recipeData);
    }
}