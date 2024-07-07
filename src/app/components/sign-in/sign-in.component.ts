import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { APIRoutesService } from '../../services/apiRoutes.service';
import { LocalStorageService } from '../../services/localStorage.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  passwordVisible: boolean = false;
  showPasswordIcon: string = 'fa-eye-slash';
  signInForm: FormGroup = new FormGroup({})

  constructor(private toastr: ToastrService, private accountService: APIRoutesService, private storageService: LocalStorageService) { }

  ngOnInit(): void {
    this.initializeForm(); // Initialize the sign-in form
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

  // Initialize the sign-in form with form controls and validators
  initializeForm(){
    this.signInForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)])
    })
  }

  // Handle sign-in form submission
  signInSubmit() {
    if (this.signInForm.valid) {
      // Form is valid, submit the sign-in data to the server
      this.accountService.signIn(this.signInForm.value).subscribe((response) => {
        // console.log('User signed in successfully', response);
        this.toastr.success(response.message);
        this.storageService.set('jwtToken', response.token);
        setTimeout(() => {
          window.location.replace('/');
        }, 1000);
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
    const formControls = this.signInForm.controls;

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
            this.toastr.warning('Password must be at least 6 characters long and include at least one digit, one lowercase letter, and one uppercase letter');
        }
        if (control.errors?.['minlength']) {
          this.toastr.warning('Password must be at least 6 characters long');
        }
      }
    });
  }

  getDisplayName(key: string): string {
    switch (key) {
      case 'email':
        return 'Email';
      case 'password':
        return 'Password';
      default:
        return key; // fallback to key if no match
    }
  }
}
