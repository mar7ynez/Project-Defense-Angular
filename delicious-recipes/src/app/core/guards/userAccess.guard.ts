import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { map, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class UserAccessGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(): Observable<boolean> {
        return this.authService.getProfile().pipe(
            map(user => {
                if (user) {
                    this.router.navigate(['/404']);
                    return false;
                }
                return true;
            })
        );
    }
}