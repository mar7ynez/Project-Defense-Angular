import { Component } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";

@Component({
    selector: 'app-navigation',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.css'
})

export class NavigationComponent {
    constructor(private authService: AuthService, private router: Router) { }

    get authenticationService() {
        return this.authService;
    }

    onLogout(e: Event): void {
        e.preventDefault();

        this.authService.logout().subscribe({
            next: () => {
                this.router.navigate(['/login']);
            }
        })
    }
}