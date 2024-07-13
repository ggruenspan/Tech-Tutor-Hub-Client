import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { APIRoutesService } from '../../services/apiRoutes.service';
import { LocalStorageService } from '../../services/localStorage.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  userName = '';
  role = '';
  email = '';
  firstName = '';
  lastName = '';
  phoneNumber = '';
  dateOfBirth = '';
  country = ' ';
  stateprovince = ' ';
  city = ' ';
  bio = '';
  pronouns = '';
  customPronouns = '';
  bioWordCount: number = 0;
  maxWords: number = 50; // Define the maximum word count
  editable = false;
  generalForm: FormGroup = new FormGroup({})
  addInfoForm: FormGroup = new FormGroup({})
  showCustomPronounsInput: boolean = false;

  constructor(private toastr: ToastrService, private accountService: APIRoutesService, private storageService: LocalStorageService) {}

  ngOnInit() {
    this.handleUserData(); // Initialize user data handling
    this.initializeForm(); // Initialize the user info form
    this.subscribeToBioChanges(); // Subscribe to bio value changes
  }

  toggleEdit() {
    this.editable = !this.editable;
    this.updateFormEditableState(); // Update form control state based on edit mode
  }

  // Initialize the sign-up form with form controls and validators
  initializeForm(){
    this.generalForm = new FormGroup({
      firstName: new FormControl({value: this.firstName, disabled: true}, Validators.required),
      lastName: new FormControl({value: this.lastName, disabled: true}, Validators.required),
      email: new FormControl({value: this.email, disabled: true}, [Validators.required, Validators.email]),
      phoneNumber: new FormControl({value: this.phoneNumber, disabled: true}, [Validators.pattern('[0-9]{10}')]),
      dateOfBirth: new FormControl({value: this.dateOfBirth, disabled: true}, Validators.required),
      country: new FormControl({value: this.country, disabled: true}, Validators.required),
      stateprovince: new FormControl({value: this.stateprovince, disabled: true}, Validators.required),
      city: new FormControl({value: this.city, disabled: true}, Validators.required),
    })

    this.addInfoForm = new FormGroup({
      bio: new FormControl({ value: this.bio, disabled: true }, this.validateWordCount(this.maxWords)),
      pronouns: new FormControl({ value: this.pronouns, disabled: true }),
      customPronouns: new FormControl({ value: this.customPronouns, disabled: true }),
    });
  }

  // Custom validator for word count
  validateWordCount(maxWords: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) return null;

      const words = control.value.trim().split(/\s+/);
      const actualWords = words.length;

      return actualWords > maxWords ? { maxWords: { actualWords, maxWords } } : null;
    };
  }

  // Subscribe to bio value changes to update word count
  subscribeToBioChanges() {
    const bioControl = this.addInfoForm.get('bio');
    if (bioControl) {
      bioControl.valueChanges.subscribe(value => {
        this.bioWordCount = this.calculateWordCount(value);
      });
    }
  }

  // Calculate word count
  calculateWordCount(text: string): number {
    if (!text) {
      return 0;
    }
    return text.trim().split(/\s+/).length;
  }

// Toggle visibility of custom pronouns input based on dropdown selection
toggleCustomPronouns(event: any) {
  const selectedPronouns = event.target.value;
  this.showCustomPronounsInput = (selectedPronouns === 'custom');

  console.log(selectedPronouns);

  // Enable/disable customPronouns control based on selection
  const customPronounsControl = this.addInfoForm.get('customPronouns');
  if (customPronounsControl) {
    if (this.showCustomPronounsInput) {
      customPronounsControl.enable();
    } else {
      customPronounsControl.disable();
      customPronounsControl.setValue(''); // Reset value when hiding the input
    }
  }
}

  // Update form control state based on edit mode
  updateFormEditableState() {
    const updateControls = (formControls: { [key: string]: any }) => {
      Object.keys(formControls).forEach(key => {
        this.editable ? formControls[key].enable() : formControls[key].disable();
      });
    };
  
    updateControls(this.generalForm.controls);
    updateControls(this.addInfoForm.controls);
  }

  // Function to capitalize the first letter of a word
  capitalizeFirstLetter(word: string): string {
    return word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : '';
  }

  // Submit updated user info
  submitNewUserInfo() {
    if (this.generalForm.valid && this.addInfoForm.valid) {

      const payload = {
        oldEmail: this.storageService.get('email'),
        firstName: this.capitalizeFirstLetter(this.generalForm.value.firstName),
        lastName: this.capitalizeFirstLetter(this.generalForm.value.lastName),
        newEmail: this.generalForm.value.email,
        phoneNumber: this.generalForm.value.phoneNumber,
        dateOfBirth: this.generalForm.value.dateOfBirth,
        country: this.capitalizeFirstLetter(this.generalForm.value.country),
        stateprovince: this.capitalizeFirstLetter(this.generalForm.value.stateprovince),
        city: this.capitalizeFirstLetter(this.generalForm.value.city),
        bio: this.addInfoForm.value.bio,
        pronouns: this.addInfoForm.value.pronouns === 'custom' ? this.addInfoForm.value.customPronouns : this.addInfoForm.value.pronouns,
      }

      // Form is valid, submit the sign-up data to the server
      this.accountService.updateUserProfile(payload).subscribe((response) => {
        // console.log('Updated profile successfully', response);
        this.toastr.success(response.message);
        this.storageService.set('jwtToken', response.token);
        setTimeout(() => {
          window.location.replace('/settings/account');
        }, 1500);
      }, (error) => {
        // console.error('error', error);
        this.toastr.error(error.error.message);
      });

      this.toggleEdit(); // Toggle edit mode
    } else {
      this.toastr.error('Please fill out the required fields correctly');
      this.validateFormFields();
    }
  }

  // Validate form fields and show toastr messages for errors
  validateFormFields() {
    this.validateControls(this.generalForm.controls);
    this.validateControls(this.addInfoForm.controls);
  }

  // Validate individual form controls
  validateControls(controls: { [key: string]: AbstractControl }) {
    Object.keys(controls).forEach(key => {
      const control = controls[key];
      if (control.invalid) {
        const errors = control.errors || {};
        if (errors['required']) {
          this.toastr.error(`${this.getDisplayName(key)} is required`);
        }
        if (errors['email']) {
          this.toastr.warning('Invalid Email Address');
        }
        if (errors['pattern']) {
          this.toastr.warning('Invalid Phone Number');
        }
        if (errors['maxWords']) {
          const { actualWords, maxWords } = errors['maxWords'];
          this.toastr.warning(`Bio cannot exceed ${maxWords} words (current count: ${actualWords})`);
        }
      }
    });
  }

  // Get display name for form field
  getDisplayName(key: string): string {
    const displayNames: { [key: string]: string } = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phoneNumber: 'Phone Number',
      dateOfBirth: 'Date Of Birth',
      street: 'Street',
      country: 'Country',
      stateprovince: 'State/Province',
      city: 'City',
      bio: 'Bio',
      pronouns: 'Pronouns',
    };
    return displayNames[key] || key;
  }

  // Retrieve user data from local storage
  handleUserData() {
    const fields: { [key: string]: string } = { userName: '', role: 'User', email: '', firstName: '', lastName: '', phoneNumber: '', dateOfBirth: '', 
      street: '', country: '', stateprovince: '',  city: '', bio: '', pronouns: ''};

    Object.keys(fields).forEach(field => {
      (this as any)[field] = this.storageService.get(field) || fields[field];
    });

    // Retrieve and format dateOfBirth
    const storedDateOfBirth = this.storageService.get('dateOfBirth');
    this.dateOfBirth = storedDateOfBirth ? new Date(storedDateOfBirth).toISOString().split('T')[0] : '';

    this.bioWordCount = this.calculateWordCount(this.bio);

    this.showCustomPronounsInput = !['', 'he/him', 'she/her', 'they/them'].includes(this.pronouns);
    if (this.showCustomPronounsInput) {
      this.customPronouns = this.pronouns;
      this.pronouns = 'custom';
    }
  }
}