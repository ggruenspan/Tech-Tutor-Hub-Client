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

  forgotPasswordSubmit() {
    if (this.forgotPasswordForm.invalid) {
      // Handle validation errors
      if (this.forgotPasswordForm.get('email')?.errors) {
        if (this.forgotPasswordForm.get('email')?.errors?.['required']) {
          this.toastr.error('Email is required');
        }
        if (this.forgotPasswordForm.get('email')?.errors?.['email']) {
          this.toastr.warning('Invalid email address');
        }
      }
    } else {
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
        }
      );
    }
  }
}
