import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { LocalStorageService } from '../services/localStorage.service';

@Injectable()

export class HttpInterceptorService implements HttpInterceptor {

constructor(private LocalStorageService: LocalStorageService) { }

intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.LocalStorageService.get('jwtToken');
    req = req.clone({
        url:  req.url,
        setHeaders: {
            Authorization: `bearer ${token}`
        }
    });
    return next.handle(req);
}}