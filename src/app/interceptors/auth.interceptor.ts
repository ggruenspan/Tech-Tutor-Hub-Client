import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { HandleDataService } from '../services/handleData.service';

@Injectable()

export class HttpInterceptorService implements HttpInterceptor {

  constructor(private dataService: HandleDataService) { }

  // Intercept method to handle HTTP requests and add authorization token
  intercept(req: HttpRequest<any>, next: HttpHandler) {
      const token = this.dataService.getToken();
      if (token) {
      // Clone the request and add the Authorization header with the JWT token
        req = req.clone({
          setHeaders: {
            Authorization: token
          }
        });
      }
      return next.handle(req);
  }
}