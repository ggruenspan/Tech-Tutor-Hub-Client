import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { ToastrService } from 'ngx-toastr';
import { map, catchError  } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class SignGuardService implements CanActivate {
    
    constructor(private accountService: AccountService, private route : Router, private toastr: ToastrService) { }

    canActivate() {
        // If the user is authenticated, redirect them to the home page
        return this.accountService.authenticate().pipe(
            map((response) => { 
                this.toastr.error("You are already Signed in");
                this.route.navigate(['/']);
                return false; 
            }),
            catchError((error) => { return of(true);})
        );
    }
}