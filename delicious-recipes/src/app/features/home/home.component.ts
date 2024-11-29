import { Component, OnInit } from "@angular/core";
import { CatalogItemComponent } from "../catalog/catalog-item/catalog-item.component";
import { Recipe } from "../../shared/types/recipe";
import { RouterLink } from "@angular/router";
import { CatalogService } from "../../core/services/recipe.service";

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [CatalogItemComponent, RouterLink]
})

export class HomeComponent implements OnInit {
    recipes: Recipe[] = [];

    constructor(private catalogService: CatalogService) { }

    ngOnInit(): void {
        this.catalogService.getMostLiked().subscribe({
            next: (mostLikedRecipes) => {
                this.recipes = mostLikedRecipes
            },
            error: (error) => {
                alert('Error getting most liked recipes!');
            }
        })
    }
}