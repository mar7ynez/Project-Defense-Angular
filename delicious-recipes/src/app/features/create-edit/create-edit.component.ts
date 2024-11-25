import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogService } from '../../core/services/recipe.service';
import { Recipe } from '../../shared/types/recipe';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [ReactiveFormsModule],
  providers: [CatalogService],
  templateUrl: './create-edit.component.html',
  styleUrl: './create-edit.component.css'
})

export class CreateEditComponent {
  isEditMode: Boolean = false;
  recipeId: string = '';
  createAndEditForm: FormGroup;

  recipe: Recipe = {
    recipeTitle: '',
    ingredients: [{ ingredientName: '', ingredientQuantity: '' }],
    imageUrl: '',
    directions: '',
    duration: '',
    likes: []
  };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private catalogService: CatalogService,
    private fb: FormBuilder,
  ) {
    this.isEditMode = Boolean(this.activatedRoute.snapshot.routeConfig?.path?.includes('edit'));
    this.recipeId = this.activatedRoute.snapshot.url[0].path;

    this.createAndEditForm = this.fb.group({
      recipeTitle: ['', Validators.required],
      ingredients: this.fb.array([]),
      imageUrl: ['', Validators.required],
      duration: ['', Validators.required],
      directions: ['', Validators.required]
    });

    if (this.isEditMode) {
      this.setFormForEdit();
    } else {
      this.ingredients.push(this.fb.group({ ingredientName: '', ingredientQuantity: '', }));
    }
  };

  get ingredients() {
    return this.createAndEditForm.get('ingredients') as FormArray;
  }

  setFormForEdit() {
    this.catalogService.getOne(this.recipeId).subscribe({
      next: recipeData => {
        this.createAndEditForm.patchValue({
          recipeTitle: recipeData.recipeTitle,
          imageUrl: recipeData.imageUrl,
          duration: recipeData.duration,
          directions: recipeData.directions
        });

        recipeData.ingredients.forEach(ingredient => {
          const ingredientForm = this.fb.group({
            ingredientName: ingredient.ingredientName,
            ingredientQuantity: ingredient.ingredientQuantity,
          });

          this.ingredients.push(ingredientForm);
        });
      },
      error: error => {
        alert('Error fetching recipe data!');
      }
    });
  }

  handleSubmit(): void {
    if (this.isEditMode) {
      this.catalogService.edit(this.createAndEditForm.value, this.recipeId).subscribe({
        next: () => {
          this.router.navigate(['/', this.recipeId, 'details']);
        },
        error: error => {
          alert('Error updating the recipe!');
        }
      });

      return;
    }

    this.catalogService.create(this.createAndEditForm.value).subscribe({
      next: () => {
        this.router.navigate(['/catalog']);
      },
      error: error => {
        console.log(error);
        alert('Error creating new recipe!');
      }
    })
  }

  addIngredient() {
    const ingredientForm = this.fb.group({
      ingredientName: ['', Validators.required],
      ingredientQuantity: ['', Validators.required]
    });

    this.ingredients.push(ingredientForm);
  }

  removeIngredient() {
    const ingrLength = this.ingredients.length - 1;

    if (!ingrLength) {
      return;
    }

    this.ingredients.removeAt(this.ingredients.length - 1)
  }
}
