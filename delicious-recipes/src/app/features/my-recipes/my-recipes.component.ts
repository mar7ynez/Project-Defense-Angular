import { Component, OnInit } from "@angular/core";
import { Recipe } from "../../shared/types/recipe";
import { CatalogService } from "../../core/services/recipe.service";
import { CatalogItemComponent } from "../catalog/catalog-item/catalog-item.component";

@Component({
    selector: 'my-recipes',
    standalone: true,
    templateUrl: './my-recipes.component.html',
    styleUrl: './my-recipes.component.css',
    imports: [CatalogItemComponent]
})

export class MyRecipes implements OnInit {
    myRecipes: Recipe[] = [];

    constructor(private recipeService: CatalogService) {

    }

    ngOnInit(): void {
        this.recipeService.getMyRecipes().subscribe({
            next: (myRecipes) => {
                this.myRecipes = myRecipes;
            }
        })
    }
}