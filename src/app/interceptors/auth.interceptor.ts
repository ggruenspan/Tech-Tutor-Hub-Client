import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

@Injectable()

export class HttpInterceptorService implements HttpInterceptor {

// Intercept method to handle HTTP requests and add authorization token
intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem('jwt');
    if (token) {
    // Clone the request and add the Authorization header with the JWT token
      req = req.clone({
        setHeaders: {
          Authorization: token
        }
      });
    }
    return next.handle(req);
}}