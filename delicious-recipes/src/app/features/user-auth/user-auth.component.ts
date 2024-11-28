import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-user-auth',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './user-auth.component.html',
  styleUrl: './user-auth.component.css'
})
export class AuthFormComponent implements OnInit {
  isLoginMode: boolean = true;
  authForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService) {
    this.authForm = this.fb.group({
      email: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      rePass: ['', Validators.required]
    });
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
}
