import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { emailValidator } from '../../shared/utilities/email.validator';
import { confirmPasswordValidator } from '../../shared/utilities/confirmPassword.validator';
import { errorTypes } from '../../shared/types/error';

@Component({
  selector: 'app-user-auth',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './user-auth.component.html',
  styleUrl: './user-auth.component.css'
})
export class AuthFormComponent implements OnInit {
  isLoginMode: boolean = true;
  authForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService) {
    this.authForm = this.fb.group({
      email: ['', { validators: [Validators.required, emailValidator] }],
      username: ['', { validators: [Validators.required, Validators.minLength(6)] }],
      passGroup: this.fb.group({
        password: ['', { validators: [Validators.required, Validators.minLength(8)] }],
        rePass: ['', { validators: [Validators.required] }],
      }, { validators: [confirmPasswordValidator('password', 'rePass')] })
    });
  }

  get passwordGroup() {
    return this.authForm.get('passGroup');
  }

  ngOnInit(): void {
    this.isLoginMode = this.router.routerState.snapshot.url === '/login';
  }

  handleSubmit() {
    const { email, username, password, rePass } = this.authForm.value;

    if (!this.isLoginMode) {
      this.authService.register({ email, username, password, rePass }).subscribe({
        next: (userData) => {
          this.router.navigateByUrl('/catalog');
        },
        error: (error) => {
          console.log(error)
          alert(error.error);
        }
      });

      return;
    }

    this.authService.login({ email, password }).subscribe({
      next: (userData) => {
        this.router.navigateByUrl('/catalog');
      },
      error: (error) => {
        console.log(error);
        alert(error.error);
      }
    });
  }

  isFormInvalid(): boolean {
    if (this.isLoginMode) {
      return !!this.authForm.controls['email'].invalid || !!this.passwordGroup?.get('password')?.invalid;
    }

    const invalidControls = [
      this.authForm.controls['email'].invalid,
      this.authForm.controls['username'].invalid,
      this.passwordGroup?.invalid,
    ];

    return invalidControls.some(control => control === true);
  }

  isFieldTouchedAndInvalid(controlName: string): boolean {
    if (controlName === 'rePass' || controlName === 'password') {
      return !!this.passwordGroup?.get(controlName)?.touched && !!this.passwordGroup?.errors || !!this.passwordGroup?.get(controlName)?.errors && !!this.passwordGroup?.get(controlName)?.touched;
    }

    return this.authForm.controls[controlName].invalid && this.authForm.controls[controlName].touched;
  }

  getControlError(controlName: string) {
    const control = this.authForm.controls[controlName] || this.passwordGroup?.get(controlName);
    const controlNameCapital = controlName === 'rePass' ? 'Confirm password' : controlName.replace(controlName[0], controlName[0].toUpperCase());

    if (controlName === 'rePass' && this.passwordGroup?.errors) {
      return this.passwordGroup.errors['confirmPassword'];
    }

    const errorMessages: errorTypes = {
      required: `${controlNameCapital} is required!`,
      emailPattern: `${controlNameCapital} does not match the required pattern!`,
      minlength: (requiredLength: number) => `${controlNameCapital} must be at least ${requiredLength} characters long!`,
    }

    for (const errorType in errorMessages) {
      if (control.hasError(errorType as keyof errorTypes)) {
        if (errorType === 'minlength') {
          const requiredLength = control.errors?.['minlength'].requiredLength;
          
          return errorMessages.minlength(requiredLength)
        }
        return errorMessages[errorType as keyof errorTypes]
      }
    }

    return '';
  }
}
