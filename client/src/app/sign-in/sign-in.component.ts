import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  providers: [MessageService],
})
export class SignInComponent {
  passwordVisible: boolean = false;
  showPasswordIcon: string = 'fa-eye-slash';
  signInForm: FormGroup = new FormGroup({})

  constructor(private messageService: MessageService, private accountService: AccountService) { }

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
          this.messageService.add({severity: 'warn', detail: 'Email is required.' });
        }
        if (this.signInForm.get('email')?.errors?.['email']) {
          this.messageService.add({severity: 'warn', detail: 'Invalid email address.' });
        }
      }
  
      if (this.signInForm.get('password')?.errors) {
        if (this.signInForm.get('password')?.errors?.['required']) {
          this.messageService.add({severity: 'warn', detail: 'Password is required.' });
        }
        if (this.signInForm.get('password')?.hasError('minlength')) {
          this.messageService.add({severity: 'warn', detail: 'Password must be at least 6 characters long.' });
        }
        if (this.signInForm.get('password')?.errors?.['pattern']) {
          this.messageService.add({severity: 'warn', detail: 'Password must include at least one digit, one lowercase letter, and one uppercase letter.' });
        }
      }
    } else {
      // Form is valid, submit the sign-up data to the server
      this.accountService.signIn(this.signInForm.value).subscribe((response) => {
          console.log('User signed up successfully', response);
          window.location.replace('/');
        }, (error) => {
          console.error('Signup error', error);
        }
      );
    }
  }
}
