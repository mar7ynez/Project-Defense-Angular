import { Component, OnInit } from '@angular/core';
import { CatalogItemComponent } from "./catalog-item/catalog-item.component";
import { CatalogService } from '../../core/services/recipe.service';
import { Recipe } from '../../shared/types/recipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CatalogItemComponent, FormsModule],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit {
  recipes: Recipe[] = [];
  searchQuery: string = '';

  constructor(private catalogService: CatalogService) { }

  ngOnInit(): void {
    this.catalogService.getRecipes().subscribe({
      next: (recipes) => {
        this.recipes = recipes;
      }
    });
  }

  onSearch() {
    this.catalogService.search(this.searchQuery).subscribe({
      next: (recipes) => {
        this.recipes = recipes;
        
        this.searchQuery = '';
      }
    })
  }
}
