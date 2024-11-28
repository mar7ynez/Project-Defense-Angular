import { Component, OnInit } from '@angular/core';
import { CatalogService } from '../../core/services/recipe.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Recipe } from '../../shared/types/recipe';
import { User } from '../../shared/types/user';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [RouterLink],
  providers: [CatalogService],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {
  recipeData: Recipe | null = null
  recipeId: string = '';
  isOwner: boolean = false;
  hasLiked: boolean = true;

  constructor(
    private catalogService: CatalogService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.recipeId = this.activatedRoute.snapshot.params['recipeId'];
    this.fetchRecipeData();
  }

  get userData(): User | null {
    return this.authService.user;
  }

  onDelete(): void {
    this.catalogService.del(this.recipeId).subscribe({
      next: () => {
        this.router.navigate(['/catalog']);
      },
      error: (error) => {
        alert('Error deleting the recipe!');
      }
    });
  }

  onLike(): void {
    this.catalogService.like(this.recipeId).subscribe({
      next: () => {
        this.router.navigate(['/', this.recipeId, 'details'])
          .then(() => this.fetchRecipeData());
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  fetchRecipeData(): void {
    this.catalogService.getOne(this.recipeId).subscribe({
      next: recipeData => {
        this.recipeData = recipeData

        this.isOwner = recipeData._ownerId === this.userData?._id
        this.hasLiked = recipeData.likes.includes(this.userData?._id ?? '');
      },
      error: error => {
        alert('Error fetching recipe data!');
      }
    });
  }
}
