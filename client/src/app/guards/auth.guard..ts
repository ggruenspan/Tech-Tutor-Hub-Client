import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { map, catchError  } from 'rxjs/operators';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})

export class AuthGuardService implements CanActivate {
    
    constructor(private accountService: AccountService, private route : Router, private toastr: ToastrService) { }

    canActivate() {
        return this.accountService.authenticate().pipe(
            map((response) => { return true; }),
            catchError((error) => {
                // If there's an error, log it and navigate to the sign-in page
                this.toastr.error("You must be signed in to access that page");
                this.route.navigate(['/sign-in']);
                // Return an observable with a value of false to indicate the navigation should not proceed
                return of(false);
            })
        );
    }
}