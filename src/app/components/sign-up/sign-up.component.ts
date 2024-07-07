import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { APIRoutesService } from '../../services/apiRoutes.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  passwordVisible = false;
  showPasswordIcon = 'fa-eye-slash';
  signUpForm: FormGroup = new FormGroup({})

  constructor(private toastr: ToastrService, private accountService: APIRoutesService) { }

  ngOnInit(): void {
    this.initializeForm(); // Initialize the sign-up form
  }

  // Toggle visibility of the password input
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
      fullName: new FormControl('', [Validators.required, Validators.pattern(/^(\w\w+)\s(\w+)$/)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)])
    })
  }
  
  // Handle sign-up form submission
  signUpSubmit() {
    if (this.signUpForm.valid) {
      // Form is valid, submit the sign-up data to the server
      this.accountService.signUp(this.signUpForm.value).subscribe((response) => {
        // console.log('User signed up successfully', response);
        this.toastr.success(response.message);
        setTimeout(() => {
          window.location.replace('/sign-in');
        }, 1500);
      }, (error) => {
        // console.error('error', error);
        this.toastr.error(error.error.message);
      });
    } else {
      this.validateFormFields();
    }
  }
  
  // Validate form fields and show toastr messages for errors
  validateFormFields() {
    const formControls = this.signUpForm.controls;

    Object.keys(formControls).forEach(key => {
      const control = formControls[key];
      if (control.invalid) {
        if (control.errors?.['required']) {
          this.toastr.error(`${this.getDisplayName(key)} is required`);
        }
        if (control.errors?.['email']) {
          this.toastr.warning('Invalid Email Address');
        }
        if (control.errors?.['pattern']) {
          if (this.signUpForm.get('fullName')?.errors) {
            this.toastr.warning('Full Name must include first name followed by last name. i.e John Smith');
          }
          if (this.signUpForm.get('password')?.errors) {
            this.toastr.warning('Password must be at least 6 characters long and include at least one digit, one lowercase letter, and one uppercase letter');
          }
        }
        if (control.errors?.['minlength']) {
          this.toastr.warning('Password must be at least 6 characters long');
        }
      }
    });
  }

  getDisplayName(key: string): string {
    switch (key) {
      case 'fullName':
        return 'Full Name';
      case 'lastName':
        return 'Last Name';
      case 'email':
        return 'Email';
      case 'password':
        return 'Password';
      default:
        return key; // fallback to key if no match
    }
  }
}
