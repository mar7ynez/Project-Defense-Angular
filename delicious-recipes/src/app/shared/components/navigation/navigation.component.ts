import { Component, HostListener, OnInit } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { User } from "../../types/user";

@Component({
    selector: 'app-navigation',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.css'
})

export class NavigationComponent implements OnInit {
    isProfileToggled: boolean = false;
    profile: User | null = null;

    constructor(private authService: AuthService, private router: Router) { }

    ngOnInit(): void {
        this.authService.user$.subscribe({
            next: (profile) => {
                this.profile = profile;
            }
        });
    }

    get authenticationService() {
        return this.authService;
    }

    onProfile(event: Event) {
        event.stopPropagation();

        this.isProfileToggled = !this.isProfileToggled;
    }

    onLogout(e: Event): void {
        e.preventDefault();

        this.isProfileToggled = false;

        this.authService.logout().subscribe({
            next: () => {
                this.router.navigate(['/']);
            }
        })
    }

    @HostListener('document:click', ['$event'])

    onDocumentClick(event: MouseEvent) {
        const menuElement = document.querySelector('.sub-menu-wrapper');
        if (menuElement && !menuElement.contains(event.target as Node) && this.isProfileToggled) {
            this.isProfileToggled = false;
        }
    }
}