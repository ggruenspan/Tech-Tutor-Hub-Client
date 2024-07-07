import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { APIRoutesService } from '../../services/apiRoutes.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup = new FormGroup({})

  constructor(private toastr: ToastrService, private accountService: APIRoutesService) { }

  ngOnInit(): void {
    this.initializeForm(); // Initialize the forgot-password form
  }
  
  // Initialize the forgot-password form with form controls and validators
  initializeForm(){
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    })
  }

  // Handle form submission for forgot-password
  forgotPasswordSubmit() {
    if (this.forgotPasswordForm.valid) {
      // Form is valid, submit the forgot-password data to the server
      this.accountService.forgotPassword(this.forgotPasswordForm.value).subscribe((response) => {
        // console.log('Reset email sent successfully', response);
        this.toastr.success(response.message);
        setTimeout(() => {
          window.location.replace('/sign-in');
        }, 3000);
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
    const formControls = this.forgotPasswordForm.controls;

    Object.keys(formControls).forEach(key => {
      const control = formControls[key];
      if (control.invalid) {
        if (control.errors?.['required']) {
          this.toastr.error(`Email is required`);
        }
        if (control.errors?.['email']) {
          this.toastr.warning('Invalid Email Address');
        }
      }
    });
  }
}
