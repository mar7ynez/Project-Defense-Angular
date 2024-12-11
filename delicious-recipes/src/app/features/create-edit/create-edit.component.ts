import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormArray, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogService } from '../../core/services/recipe.service';
import { getErrorMsg, isFieldTouchedAndInvalid } from '../../shared/utilities/getErrorUtils';
import { AuthService } from '../../core/services/auth.service';
import { fileSelect } from '../../shared/utilities/fileSelect';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-edit.component.html',
  styleUrl: './create-edit.component.css'
})

export class CreateEditComponent implements OnInit {
  isEditMode: Boolean = false;
  recipeId: string = '';
  createAndEditForm: FormGroup;
  imageData: string | null = null;
  imageName: string = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private catalogService: CatalogService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.createAndEditForm = this.fb.group({
      recipeTitle: ['', { validators: [Validators.required, Validators.minLength(10)] }],
      ingredients: this.fb.array([], { validators: [Validators.required] }),
      image: [null, { validators: [Validators.required] }],
      duration: ['', { validators: [Validators.required, Validators.minLength(4)] }],
      directions: ['', { validators: [Validators.required, Validators.minLength(30)] }]
    });
  };

  ngOnInit() {
    this.isEditMode = Boolean(this.activatedRoute.snapshot.routeConfig?.path?.includes('edit'));
    this.recipeId = this.activatedRoute.snapshot.url[0].path;

    if (this.isEditMode) {
      this.setFormForEdit();
    } else {
      this.ingredients.push(this.fb.group({ ingredientName: ['', { validators: [Validators.required] }], ingredientQuantity: ['', { validators: [Validators.required] }] }));
    }
  }

  get ingredients() {
    return this.createAndEditForm.get('ingredients') as FormArray;
  }

  setFormForEdit() {
    this.catalogService.getOne(this.recipeId).subscribe({
      next: recipeData => {
        const userId = this.authService.user?._id;
        const ownerId = recipeData._ownerId;

        if (userId !== ownerId) {
          this.router.navigate(['/404']);
        }

        this.createAndEditForm.patchValue({
          recipeTitle: recipeData.recipeTitle,
          image: recipeData.image,
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
      }
    });
  }

  handleSubmit(): void {
    if (this.isEditMode) {
      this.catalogService.edit(this.createAndEditForm.value, this.recipeId).subscribe({
        next: () => {
          this.router.navigate(['/', this.recipeId, 'details']);
        }
      });

      return;
    }

    this.catalogService.create(this.createAndEditForm.value).subscribe({
      next: () => {
        this.router.navigate(['/catalog']);
      }
    })
  }

  addIngredient(): void {
    const ingredientForm = this.fb.group({
      ingredientName: ['', { validators: [Validators.required] }],
      ingredientQuantity: ['', { validators: [Validators.required] }]
    });

    this.ingredients.push(ingredientForm);
  }

  removeIngredient(): void {
    const ingrLength = this.ingredients.length - 1;

    if (!ingrLength) {
      return;
    }

    this.ingredients.removeAt(this.ingredients.length - 1)
  }

  triggerFileInput(e: Event, fileInput: HTMLInputElement) {
    e.preventDefault();

    fileInput.click();
  }

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement && inputElement.files) {
      this.imageName = inputElement.files[0]?.name;
    }

    fileSelect(event, this.createAndEditForm, (data: string | null) => {
      this.imageData = data;
    });
  }

  isFormInvalid(): boolean {
    const invalidControls = [
      this.createAndEditForm.controls['recipeTitle'].invalid,
      this.createAndEditForm.controls['duration'].invalid,
      this.createAndEditForm.controls['directions'].invalid,
    ];

    const hasInvalidIngredientFields = this.ingredients.controls.some((group: AbstractControl) => {
      return group.get('ingredientName')?.invalid || group.get('ingredientQuantity')?.invalid;
    });

    return invalidControls.some((control) => control === true) || hasInvalidIngredientFields || !this.imageName && !this.isEditMode;
  }

  touchedAndInvalid(form: FormGroup, abstractControl: AbstractControl | null, controlName: string) {
    return isFieldTouchedAndInvalid(form, abstractControl, controlName);
  }

  getControlError(form: FormGroup, abstractControl: AbstractControl | null, controlName: string) {
    return getErrorMsg(form, abstractControl, controlName);
  }
}
