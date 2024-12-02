import { Component, OnInit } from '@angular/core';
import { CatalogItemComponent } from "./catalog-item/catalog-item.component";
import { CatalogService } from '../../core/services/recipe.service';
import { Recipe } from '../../shared/types/recipe';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CatalogItemComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit {
  recipes: Recipe[] = [];

  constructor(private catalogService: CatalogService) { }

  ngOnInit(): void {
    this.catalogService.getRecipes().subscribe({
      next: (recipes) => {
        this.recipes = recipes;
      },
      error: (error) => {
        alert('Error fetching the recipes!')
      }
    });
  }
}
