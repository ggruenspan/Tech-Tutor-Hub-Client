import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { APIRoutesService } from '../services/apiRoutes.service';
import { ToastrService } from 'ngx-toastr';
import { map, catchError  } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class AuthGuardService implements CanActivate {
    
    constructor(private accountService: APIRoutesService, private route : Router, private toastr: ToastrService) { }

    canActivate() {
        // If the user is authenticated, redirect them to the home page
        return this.accountService.authenticate().pipe(
            map((response) => { 
                this.toastr.error("You are already signed in");
                this.route.navigate(['/']);
                return false; 
            }),
            catchError((error) => { return of(true);})
        );
    }
}