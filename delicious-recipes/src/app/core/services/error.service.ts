import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})

export class ErrorService {
    apiError$$ = new BehaviorSubject('');
    apiError$ = this.apiError$$.asObservable();

    constructor() { }

    setError(error: any): void {
        this.apiError$$.next(error);
    }
}