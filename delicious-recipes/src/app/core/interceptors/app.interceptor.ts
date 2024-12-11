import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError } from "rxjs";
import { ErrorService } from "../services/error.service";

export const appInterceptor: HttpInterceptorFn = (request, next) => {
    const router = inject(Router);
    const errorService = inject(ErrorService);

    request = request.clone({
        withCredentials: true
    });

    return next(request).pipe(
        catchError((error) => {

            errorService.setError(error.error.error);

            if (error.status === 401) {
                router.navigate([router.url]);
            } else {
                router.navigate(['/']);
            }

            return [error]
        })
    );
}