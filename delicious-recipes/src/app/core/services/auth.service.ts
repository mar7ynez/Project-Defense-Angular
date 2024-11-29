import { HttpClient } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import { host, endpoints } from "../../../environments/environment";
import { User } from "../../shared/types/user";
import { BehaviorSubject, Subscription, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class AuthService implements OnDestroy {

    user$$ = new BehaviorSubject<User | null>(null);
    user$ = this.user$$.asObservable();
    user: User | null = null;
    userSub: Subscription | null = null;

    constructor(private http: HttpClient) {
        this.userSub = this.user$.subscribe({
            next: (userData) => {
                this.user = userData;
            }
        })
    }

    get isAuth(): boolean {
        return Boolean(this.user);
    }


    register(userData: User) {
        return this.http.post<User>(`${host}${endpoints.register}`, userData)
            .pipe(tap((userData) => this.user$$.next(userData)));
    }

    login(userData: User) {
        return this.http.post<User>(`${host}${endpoints.login}`, userData)
            .pipe(tap((userData) => this.user$$.next(userData)));
    }

    logout() {
        return this.http.get(`${host}${endpoints.logout}`)
            .pipe(tap(() => this.user$$.next(null)));
    }

    getProfile() {
        return this.http.get<User>(`${host}${endpoints.profile}`)
            .pipe(tap((userData) => this.user$$.next(userData)));
    }

    ngOnDestroy(): void {
        this.userSub?.unsubscribe();
    }
}