import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../services/account.service';
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

  constructor(private toastr: ToastrService, private accountService: AccountService, private route: ActivatedRoute) { }

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

  resetPasswordSubmit() {
    if (this.resetPasswordForm.invalid) {
      // Handle validation errors
      if (this.resetPasswordForm.get('password')?.errors) {
        if (this.resetPasswordForm.get('password')?.errors?.['required']) {
          this.toastr.error('Password is required');
        }
        if (this.resetPasswordForm.get('password')?.hasError('minlength')) {
          this.toastr.warning('Password must be at least 6 characters long');
        }
        if (this.resetPasswordForm.get('password')?.errors?.['pattern']) {
          this.toastr.warning('Password must include at least one digit, one lowercase letter, and one uppercase letter');
        }
      }
    } else {
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
        }
      );
    }
  }
}
