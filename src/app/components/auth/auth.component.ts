import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthRoutesService } from '../../services/routes/authRoutes.service';
import { SettingsRoutesService } from '../../services/routes/settingsRoutes.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-auth-component',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  // Input to determine the mode of the form (signIn, signUp, forgotPassword, or resetPassword)
  @Input() mode?: 'signIn' | 'signUp' | 'forgotPassword' | 'resetPassword' | 'verifyEmail';
  @Output() formSubmit = new EventEmitter<any>();
  authForm!: FormGroup;
  passwordVisible: boolean = false;
  showPasswordIcon: string = 'fa-eye-slash';
  token: any;

  constructor(private fb: FormBuilder, private toastr: ToastrService, private authService: AuthRoutesService, 
              private route: ActivatedRoute, private settingsRoutes: SettingsRoutesService) {}

  ngOnInit() {
    this.initializeForm();
    this.token = this.route.snapshot.paramMap.get('token');
  }

  // Initializes the form based on the current mode
  initializeForm() {
    this.authForm = this.fb.group({
      fullName: ['', this.mode === 'signUp' ? [Validators.required, Validators.pattern(/^(\w\w+)\s(\w+)$/)] : this.mode === 'verifyEmail' ? [] : []],
      email: ['', this.mode !== 'resetPassword' && this.mode !== 'verifyEmail' ? [Validators.required, Validators.pattern(/^[^@]+@[^@]+\.[^@]+$/)] : []],
      password: ['', this.mode !== 'forgotPassword' && this.mode !== 'verifyEmail' ? [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)] : []],
    });
  }

  // Toggles the visibility of the password field
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
    this.showPasswordIcon = this.passwordVisible ? 'fa-eye' : 'fa-eye-slash';
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    if (passwordInput) {
      passwordInput.type = this.passwordVisible ? 'text' : 'password';
    }
  }

  // Handles form submission based on the current mode
  onSubmit() {
    if (this.authForm.valid) {
      if (this.mode === 'signIn') {
        this.signIn();
      } else if (this.mode === 'signUp') {
        this.signUp();
      } else if (this.mode === 'forgotPassword') {
        this.forgotPasswordSubmit();
      } else if (this.mode === 'resetPassword') {
        this.resetPasswordSubmit();
      } else if (this.mode === 'verifyEmail') {
        this.verifyEmailSubmit();
      }
    } else {
      this.validateFormFields();
    }
  }

  // Handle form submission for sign-in
  signIn() {
    this.authService.signIn(this.authForm.value).subscribe((response) => {
      this.settingsRoutes.getProfileImage().subscribe(() => {
        this.toastr.success(response.message);
        setTimeout(() => {
          window.location.replace('/');
        }, 1500);
      }, (error) => {
        this.toastr.error(error.error.message);
      });
    }, (error) => {
      this.toastr.error(error.error.message);
    });
  }

  // Handle form submission for sign-up
  signUp() {
    this.authService.signUp(this.authForm.value).subscribe((response) => {
      this.toastr.success(response.message);
      setTimeout(() => {
        window.location.replace('/sign-in');
      }, 2500);
    }, (error) => {
      this.toastr.error(error.error.message);
    });
  }

  // Handle form submission for forgot-password
  forgotPasswordSubmit() {
    this.authService.forgotPassword(this.authForm.value).subscribe((response) => {
      this.toastr.success(response.message);
      setTimeout(() => {
        window.location.replace('/sign-in');
      }, 2500);
    }, (error) => {
      this.toastr.error(error.error.message);
    });
  }

  // Handle form submission for reset-password
  resetPasswordSubmit() {
    this.authService.resetPassword(this.token, this.authForm.value).subscribe((response) => {
      this.toastr.success(response.message);
      setTimeout(() => {
        window.location.replace('/sign-in');
      }, 3000);
    }, (error) => {
      this.toastr.error(error.error.message);
    });
  }

  // Handle form submission for email verification
  verifyEmailSubmit() {
    this.authService.verifyEmail(this.token).subscribe((response) => {
      this.toastr.success(response.message);
      setTimeout(() => {
        window.location.replace('/sign-in');
      }, 2500);
    }, (error) => {
      this.toastr.error(error.error.message);
    });
  }

  // Validates form fields and shows error messages if invalid
  validateFormFields() {
    const formControls = this.authForm.controls;

    Object.keys(formControls).forEach(key => {
      const control = formControls[key];
      if (control.invalid) {
        if (control.errors?.['required']) {
          this.toastr.error(`${this.getDisplayName(key)} is required`);
        }
        if (control.errors?.['pattern']) {
          if (this.getDisplayName(key) === 'Full Name') {
            this.toastr.warning('Full Name must include first name followed by last name. i.e John Smith');
          }
          if (this.getDisplayName(key) === 'Email') {
            this.toastr.warning('Invalid Email Address');
          }
          if (this.getDisplayName(key) === 'Password') {
            this.toastr.warning('Password must be at least 6 characters long and include at least one digit, one lowercase letter, and one uppercase letter');
          }
        }
        if (control.errors?.['minlength']) {
          this.toastr.warning('Password must be at least 6 characters long');
        }
        if (control.errors?.['mismatch']) {
          this.toastr.warning('Passwords do not match');
        }
      }
    });
  }
  
  // Maps form control keys to display names for error messages
  getDisplayName(key: string): string {
    const displayNames: { [key: string]: string } = {
      fullName: 'Full Name',
      email: 'Email',
      password: 'Password'
    };
    return displayNames[key] || key;
  }
}
