import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';

@Injectable()

export class HttpInterceptorService implements HttpInterceptor {

constructor() { }

intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem('jwtToken');
    req = req.clone({
        url:  req.url,
        setHeaders: {
            Authorization: `bearer ${token}`
        }
    });
    return next.handle(req);
}}