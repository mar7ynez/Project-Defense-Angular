import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-auth',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-auth.component.html',
  styleUrl: './user-auth.component.css'
})
export class AuthFormComponent {
  isLoginMode: Boolean = true;

  constructor(route: Router) {
    this.isLoginMode = route.routerState.snapshot.url === '/login';
  }

}
