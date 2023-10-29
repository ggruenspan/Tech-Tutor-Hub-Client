import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  passwordVisible = false;
  showPasswordIcon = 'fa-eye-slash';
  signUpForm: FormGroup = new FormGroup({})

  constructor(private toastr: ToastrService, private accountService: AccountService) { }

  ngOnInit(): void {
    this.initializeForm(); // Initialize the sign-up form
  }

  // Toggle password visibility
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
    this.signUpForm = new FormGroup({
      fullName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)])
    })
  }
  
  // Handle sign-up form submission
  signUpSubmit() {
    if (this.signUpForm.invalid) {
      // Handle validation errors
      if (this.signUpForm.get('fullName')?.errors) {
        this.toastr.error('Full Name is required');
      }
  
      if (this.signUpForm.get('email')?.errors) {
        if (this.signUpForm.get('email')?.errors?.['required']) {
          this.toastr.error('Email is required');
        }
        if (this.signUpForm.get('email')?.errors?.['email']) {
          this.toastr.warning('Invalid email address');
        }
      }
  
      if (this.signUpForm.get('password')?.errors) {
        if (this.signUpForm.get('password')?.errors?.['required']) {
          this.toastr.error('Password is required');
        }
        if (this.signUpForm.get('password')?.hasError('minlength')) {
          this.toastr.warning('Password must be at least 6 characters long');
        }
        if (this.signUpForm.get('password')?.errors?.['pattern']) {
          this.toastr.warning('Password must include at least one digit, one lowercase letter, and one uppercase letter');
        }
      }
    } else {
      // Form is valid, submit the sign-up data to the server
      this.accountService.signUp(this.signUpForm.value).subscribe((response) => {
          console.log('User signed up successfully', response);
          window.location.replace('/sign-in');
        }, (error) => {
          console.error('Signup error', error);
        }
      );
    }
  }
}
