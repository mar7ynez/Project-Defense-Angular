import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Recipe } from '../../../shared/types/recipe';

@Component({
  selector: 'catalog-item',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './catalog-item.component.html',
  styleUrl: './catalog-item.component.css'
})

export class CatalogItemComponent {
  @Input() allRecipes: Recipe[] = [];

  logRec () {
    console.log(this.allRecipes);
  }
}
