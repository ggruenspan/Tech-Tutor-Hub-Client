import { Component } from '@angular/core';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  passwordVisible: boolean = false;
  showPasswordIcon: string = 'fa-eye-slash';

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
    this.showPasswordIcon = this.passwordVisible ? 'fa-eye' : 'fa-eye-slash';
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    if (passwordInput) {
      passwordInput.type = this.passwordVisible ? 'text' : 'password';
    }
  }

  signUpSubmit() {
    console.log('signUpSubmit');
  }
}