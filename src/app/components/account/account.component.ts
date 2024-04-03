import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../services/localStorage.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  userName = '';
  profession = '';
  email = '';
  firstName = '';
  lastName = '';
  phone = '';
  dof = '';
  editable = false;

  constructor(private storageService: LocalStorageService) {}

  ngOnInit() {
    this.handleUserData(); // Initialize user data handling
  }

  toggleEdit() {
    this.editable = !this.editable;
  }

  submitNewUserInfo() {
    if (this.editable) {
      this.editable = false;
    }
  }

  private handleUserData() {
    // Retrieve the from local storage
    const storedUserName = this.storageService.get('userName');
    const storedProfession = this.storageService.get('profession');
    const storedEmail = this.storageService.get('email');
    const storedFirstName = this.storageService.get('firstName');
    const storedLastName = this.storageService.get('lastName');
    const storedPhone = this.storageService.get('phone');
    const storedDOF = this.storageService.get('dof');

    this.userName = storedUserName !== null ? storedUserName : '';
    this.profession = storedProfession !== null ? storedProfession : 'User';
    this.email = storedEmail !== null ? storedEmail : '';
    this.firstName = storedFirstName !== null ? storedFirstName : '';
    this.lastName = storedLastName !== null ? storedLastName : '';
    this.phone = storedPhone !== null ? storedPhone : '';
    this.dof = storedDOF !== null ? storedDOF : '';
  };
}
