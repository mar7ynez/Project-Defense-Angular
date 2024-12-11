import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { emailValidator } from '../../shared/utilities/email.validator';
import { confirmPasswordValidator } from '../../shared/utilities/confirmPassword.validator';
import { getErrorMsg, isFieldTouchedAndInvalid } from '../../shared/utilities/getErrorUtils';

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
    const { email, username } = this.authForm.value;
    const password = this.passwordGroup?.get('password')?.value;
    const rePass = this.passwordGroup?.get('rePass')?.value;

    if (!this.isLoginMode) {
      this.authService.register({ email, username, password, rePass }).subscribe({
        next: (userData) => {
          this.router.navigateByUrl('/');
        }
      });

      return;
    }

    this.authService.login({ email, password }).subscribe({
      next: (userData) => {
        this.router.navigateByUrl('/');
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

  touchedAndInvalid(form: FormGroup, abstractControl: AbstractControl | null, controlName: string) {
    return isFieldTouchedAndInvalid(form, abstractControl, controlName);
  }

  getControlError(form: FormGroup, abstractControl: AbstractControl | null, controlName: string) {
    return getErrorMsg(form, abstractControl, controlName);
  }
}
