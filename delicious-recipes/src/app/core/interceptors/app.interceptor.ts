import { HttpInterceptorFn } from "@angular/common/http";

export const appInterceptor: HttpInterceptorFn = (request, next) => {

    request = request.clone({
        withCredentials: true
    });

    return next(request);
}