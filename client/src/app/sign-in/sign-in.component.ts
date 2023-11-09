import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../services/account.service';
import { LocalStorageService } from '../services/localStorage.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  passwordVisible: boolean = false;
  showPasswordIcon: string = 'fa-eye-slash';
  signInForm: FormGroup = new FormGroup({})

  constructor(private toastr: ToastrService, private accountService: AccountService, private LocalStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.initializeForm(); // Initialize the sign-up form
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
    this.showPasswordIcon = this.passwordVisible ? 'fa-eye' : 'fa-eye-slash';
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    if (passwordInput) {
      passwordInput.type = this.passwordVisible ? 'text' : 'password';
    }
  }

  // Initialize the sign-up form with form controls and validators
  initializeForm(){
    this.signInForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)])
    })
  }

  signInSubmit() {
    if (this.signInForm.invalid) {
      // Handle validation errors
      if (this.signInForm.get('email')?.errors) {
        if (this.signInForm.get('email')?.errors?.['required']) {
          this.toastr.error('Email is required');
        }
        if (this.signInForm.get('email')?.errors?.['email']) {
          this.toastr.warning('Invalid email address');
        }
      }
  
      if (this.signInForm.get('password')?.errors) {
        if (this.signInForm.get('password')?.errors?.['required']) {
          this.toastr.error('Password is required');
        }
        if (this.signInForm.get('password')?.hasError('minlength')) {
          this.toastr.warning('Password must be at least 6 characters long');
        }
        if (this.signInForm.get('password')?.errors?.['pattern']) {
          this.toastr.warning('Password must include at least one digit, one lowercase letter, and one uppercase letter');
        }
      }
    } else {
      // Form is valid, submit the sign-up data to the server
      this.accountService.signIn(this.signInForm.value).subscribe((response) => {
          // console.log('User signed in successfully', response);
          this.toastr.success(response.message);
          this.LocalStorageService.set('jwtToken', response.token);
          setTimeout(() => {
            window.location.replace('/');
          }, 3000);
        }, (error) => {
          // console.error('Signup error', error);
          this.toastr.error(error.error.message);
        }
      );
    }
  }
}
