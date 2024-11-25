import { Component, OnInit } from '@angular/core';
import { CatalogService } from '../../core/services/recipe.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Recipe } from '../../shared/types/recipe';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [RouterLink],
  providers: [CatalogService],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {
  recipeDetails: Recipe | null = null

  constructor(private catalogService: CatalogService, private router: ActivatedRoute) { }

  ngOnInit(): void {
    this.catalogService.getOne(this.router.snapshot.params['recipeId']).subscribe({
      next: recipeDetails => {
        this.recipeDetails = recipeDetails
      },
      error: error => {
        alert('Error fetching recipe data!');
      }
    });
  }
}
