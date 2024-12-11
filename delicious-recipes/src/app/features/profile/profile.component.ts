import { Component, OnInit } from "@angular/core";
import { CatalogService } from "../../core/services/recipe.service";
import { Recipe } from "../../shared/types/recipe";
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../core/services/auth.service";
import { User } from "../../shared/types/user";
import { Router } from "@angular/router";
import { emailValidator } from "../../shared/utilities/email.validator";
import { confirmPasswordValidator } from "../../shared/utilities/confirmPassword.validator";
import { getErrorMsg, isFieldTouchedAndInvalid } from "../../shared/utilities/getErrorUtils";
import { fileSelect } from "../../shared/utilities/fileSelect";

@Component({
    selector: 'app-profile',
    standalone: true,
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css',
    imports: [ReactiveFormsModule]
})

export class ProfileComponent implements OnInit {
    fileName: string | null = null;
    allRecipes: Recipe[] = [];
    fileForm: FormGroup;
    editForm: FormGroup;
    imageData: string | null = '';
    profile: User | undefined | null;

    constructor(private catalogService: CatalogService, private authService: AuthService, private fb: FormBuilder, private router: Router) {
        this.fileForm = this.fb.group({
            image: [null],
        });

        this.editForm = this.fb.group({
            email: ['', { validators: [Validators.required, emailValidator] }],
            username: ['', { validators: [Validators.required, Validators.minLength(6)] }],
            passGroup: this.fb.group({
                password: ['', { validators: [Validators.required, Validators.minLength(8)] }],
                rePass: ['', { validators: [Validators.required] }],
            }, { validators: [confirmPasswordValidator('password', 'rePass')] })
        });
    }

    ngOnInit(): void {
        this.fetchProfileData(this.editForm);
    }

    triggerFileInput(fileInput: HTMLInputElement) {
        fileInput.click();
    }

    onFileSelected(event: Event) {
        fileSelect(event, this.fileForm, (data: string | null) => {
            this.imageData = data as string;
        });
    }

    onImgSubmit() {
        this.authService.updateAvatar(this.fileForm.value.image).subscribe({
            next: () => {
                this.fetchProfileData(null);
            }
        });

        this.fileForm.reset();
        this.imageData = null;
    }

    onEdit() {
        const updatedProfile = {
            email: this.editForm.value.email,
            username: this.editForm.value.username,
            password: this.editForm.value.passGroup.password,
            rePass: this.editForm.value.passGroup.rePass
        }

        this.authService.updateProfile(updatedProfile).subscribe({
            next: (updatedProfile) => {
                this.ngOnInit();
                this.editForm.reset();
            }
        })
    }

    get passwordGroup() {
        return this.editForm.get('passGroup');
    }

    isFormInvalid(): boolean {
        const invalidControls = [
            this.editForm.controls['email'].invalid,
            this.editForm.controls['username'].invalid,
            this.passwordGroup?.invalid,
        ];

        return invalidControls.some(control => control === true);
    }

    touchedAndInvalid(form: FormGroup, abstractControl: AbstractControl | null, controlName: string) {
        return isFieldTouchedAndInvalid(form, abstractControl, controlName);
    }

    getControlError(form: FormGroup, abstractControl: AbstractControl | null, controlName: string) {
        return getErrorMsg(form, abstractControl, controlName);
    }

    onDelete() {
        this.authService.deleteProfile().subscribe({
            next: () => {
                this.fetchProfileData(null)
                this.router.navigate(['/']);
            }
        })
    }

    fetchProfileData(form: FormGroup | null) {
        this.authService.getProfile().subscribe({
            next: (profile) => {
                this.profile = profile;

                if (form) {
                    form.patchValue({ email: profile.email, username: profile.username });
                }
            }
        })
    }
}