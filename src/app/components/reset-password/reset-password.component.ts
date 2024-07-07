import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { APIRoutesService } from '../../services/apiRoutes.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  passwordVisible = false;
  showPasswordIcon = 'fa-eye-slash';
  resetPasswordForm: FormGroup = new FormGroup({})
  token: any;

  constructor(private toastr: ToastrService, private accountService: APIRoutesService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.initializeForm(); // Initialize the reset-password form
    this.token = this.route.snapshot.paramMap.get('token');
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

  // Initialize the reset-password form with form controls and validators
  initializeForm(){
    this.resetPasswordForm = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)])
    })
  }

   // Handle form submission for resetting the password
  resetPasswordSubmit() {
    if (this.resetPasswordForm.valid) {
      // Form is valid, submit the sign-up data to the server
      this.accountService.resetPassword(this.token, this.resetPasswordForm.value).subscribe((response) => {
        // console.log('User signed up successfully', response);
        this.toastr.success(response.message);
        setTimeout(() => {
          window.location.replace('/sign-in');
        }, 3000);
      }, (error) => {
        // console.error('Signup error', error);
        this.toastr.error(error.error.message);
      });
    } else {
      this.validateFormFields();
    }
  }

  // Validate form fields and show toastr messages for errors
  validateFormFields() {
    const formControls = this.resetPasswordForm.controls;

    Object.keys(formControls).forEach(key => {
      const control = formControls[key];
      if (control.invalid) {
        if (control.errors?.['required']) {
          this.toastr.error(`Password is required`);
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
}
