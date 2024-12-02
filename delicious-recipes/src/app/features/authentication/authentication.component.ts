import { Component, OnInit } from "@angular/core";
import { LoaderComponent } from "../../shared/components/loader/loader.component";
import { AuthService } from "../../core/services/auth.service";
@Component({
    selector: 'app-authentication',
    standalone: true,
    templateUrl: './authentication.component.html',
    styleUrl: './authentication.component.css',
    imports: [LoaderComponent]
})

export class AuthenticationComponent implements OnInit {
    isAuthenticating: boolean = true;

    constructor(private authService: AuthService) { }

    ngOnInit(): void {
        this.authService.getProfile().subscribe({
            next: (userData) => {
                this.isAuthenticating = false
            },
            error: (error) => {
                this.isAuthenticating = false
            },
            complete: () => {
                this.isAuthenticating = false
            }
        });
    }
}