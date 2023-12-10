import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { LocalStorageService } from '../services/localStorage.service';

@Injectable()

export class HttpInterceptorService implements HttpInterceptor {

constructor(private storageService: LocalStorageService) { }

// Intercept method to handle HTTP requests and add authorization token
intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.storageService.get('jwtToken');
    // Clone the request and add the Authorization header with the JWT token
    req = req.clone({
        url:  req.url,
        setHeaders: {
            Authorization: `bearer ${token}`
        }
    });
    return next.handle(req);
}}