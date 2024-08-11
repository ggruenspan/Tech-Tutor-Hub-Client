import { Component, OnInit, NgZone, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { APIRoutesService } from '../../services/apiRoutes.service';
import { HandleDataService } from '../../services/handleData.service';

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
  location = '';
  country = ' ';
  stateProvince = ' ';
  city = ' ';
  bio = '';
  pronouns = '';
  customPronouns = '';
  bioWordCount: number = 0;
  maxWords: number = 50; // Define the maximum word count
  formEditability = false;
  photoEditability = false;
  generalForm: FormGroup = new FormGroup({})
  addInfoForm: FormGroup = new FormGroup({})
  showCustomPronounsInput: boolean = false;
  autocompleteResults: any[] = [];
  autocompleteInput: any;
  profileImage: string | null = null;

  constructor( private ngZone: NgZone, private renderer: Renderer2, private http: HttpClient, 
               private toastr: ToastrService, private apiService: APIRoutesService, 
               private dataService: HandleDataService) {}

  ngOnInit() {
    this.handleUserData(); // Initialize user data handling
    this.initializeForm(); // Initialize the user info form
    this.subscribeToBioChanges(); // Subscribe to bio value changes
  }

  ngAfterViewInit() {
    this.initializeAutocomplete();
  }

  // Retrieve user data from local storage
  handleUserData() {
    this.apiService.getUserData().subscribe(() => {
      const profileData = this.dataService.getUserProfile();
      if (profileData) {
        this.profileImage = localStorage.getItem('profileImage');
      
        const fields: { [key: string]: string } = { userName: '', role: 'User', email: '', firstName: '', lastName: '', phoneNumber: '', dateOfBirth: '', 
          country: '', stateProvince: '',  city: '', bio: '', pronouns: ''};
    
        Object.keys(fields).forEach(field => {
          (this as any)[field] = profileData[field] || fields[field];
        });
    
        // Retrieve and format dateOfBirth
        this.dateOfBirth = profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toISOString().split('T')[0] : '';
    
        this.location = this.country && this.stateProvince && this.city ? `${this.country}, ${this.stateProvince}, ${this.city}` : '';
    
        this.bioWordCount = this.calculateWordCount(this.bio);

        this.showCustomPronounsInput = !['', 'he/him', 'she/her', 'they/them'].includes(this.pronouns);
        if (this.showCustomPronounsInput) {
          this.customPronouns = this.pronouns;
          this.pronouns = 'custom';
        }

        // Reinitialize the form with updated data
        this.initializeForm();
      }
    }, (error) => {
      console.error('Internal server error. Please try again');
    });
  }

  // Initialize the sign-up form with form controls and validators
  initializeForm(){
    this.generalForm = new FormGroup({
      firstName: new FormControl({value: this.firstName, disabled: true}, Validators.required),
      lastName: new FormControl({value: this.lastName, disabled: true}, Validators.required),
      email: new FormControl({value: this.email, disabled: true}, [Validators.required, Validators.pattern(/^[^@]+@[^@]+\.[^@]+$/)]),
      phoneNumber: new FormControl({value: this.phoneNumber, disabled: true}, [Validators.pattern('[0-9]{1,15}')]),
      dateOfBirth: new FormControl({value: this.dateOfBirth, disabled: true}, Validators.required),
      location: new FormControl({value: this.location, disabled: true}, Validators.required),
    })

    this.addInfoForm = new FormGroup({
      bio: new FormControl({ value: this.bio, disabled: true }, this.validateWordCount(this.maxWords)),
      pronouns: new FormControl({ value: this.pronouns, disabled: true }),
      customPronouns: new FormControl({ value: this.customPronouns, disabled: true }),
    });
  }

  // Initializes autocomplete functionality for the location input field.
  initializeAutocomplete() {
    const input = document.getElementById('location') as HTMLInputElement;
    input.addEventListener('input', (event) => {
      const query = (event.target as HTMLInputElement).value;
      if (query.length > 2) {
        this.searchAddress(query);
      } else {
        this.autocompleteResults = [];
      }
    });
  }

  // Searches for addresses based on the provided query using OpenStreetMap API.
  searchAddress(query: string) {
    const url = `https://nominatim.openstreetmap.org/search?addressdetails&format=json&q=${query}`;
    this.http.get(url).subscribe((results: any) => {
      this.ngZone.run(() => {
        this.autocompleteResults = results;
      });
    });
  }

  // Selects an address from the autocomplete results and updates the location input field.
  selectAddress(address: any) {
    this.autocompleteResults = [];
    
    // Destructure address data, handle cases where 'state or province' may be labeled as 'yes' in API
    const { address: { country, state, yes, state_district, city, town, village, county } } = address;
  
    const stateProvince = state || yes || state_district;
    const area = city || town || village || county;
    let locationString = `${country}, ${stateProvince}, ${area}`;
  
    (document.getElementById('location') as HTMLInputElement).value = locationString;
    this.country = country;
    this.stateProvince = stateProvince;
    this.city = area;
  }
  
  // Toggles the edit mode of the ProfileImageUploader Modal
  editPhoto(): void {
    this.photoEditability = !this.photoEditability;
    this.renderer.setStyle(document.body, 'overflow', this.photoEditability ? 'hidden' : '');
    this.renderer.setAttribute(document.body, 'scroll', this.photoEditability ? 'no' : '');
  }

  // Toggles the edit mode of the form between editable and non-editable states.
  editForm() {
    this.formEditability = !this.formEditability;
    this.updateFormEditableState(); // Update form control state based on edit mode
  }

  // Update form control state based on edit mode
  updateFormEditableState() {
    const updateControls = (formControls: { [key: string]: any }) => {
      Object.keys(formControls).forEach(key => {
        this.formEditability ? formControls[key].enable() : formControls[key].disable();
      });
    };
  
    updateControls(this.generalForm.controls);
    updateControls(this.addInfoForm.controls);
  }

  // Submit updated user info
  submitNewUserInfo() {
    if (this.generalForm.valid && this.addInfoForm.valid) {

      const payload = {
        oldEmail: this.email,
        firstName: this.generalForm.value.firstName.charAt(0).toUpperCase() + this.generalForm.value.firstName.slice(1).toLowerCase(),
        lastName: this.generalForm.value.lastName.charAt(0).toUpperCase() + this.generalForm.value.lastName.slice(1).toLowerCase(),
        newEmail: this.generalForm.value.email,
        phoneNumber: this.generalForm.value.phoneNumber,
        dateOfBirth: this.generalForm.value.dateOfBirth,
        country: this.country,
        stateProvince: this.stateProvince,
        city: this.city,
        bio: this.addInfoForm.value.bio,
        pronouns: this.addInfoForm.value.pronouns === 'custom' ? this.addInfoForm.value.customPronouns : this.addInfoForm.value.pronouns,
      }

      // Form is valid, submit the sign-up data to the server
      this.apiService.updateUserProfile(payload).subscribe((response) => {
        this.toastr.success(response.message);
        setTimeout(() => {
          window.location.replace('/settings/account');
        }, 1500);
      }, (error) => {
        this.toastr.error(error.error.message);
      });
    } else {
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
        if (control.errors?.['pattern']) {
          if (this.getDisplayName(key) === 'Email') {
            this.toastr.warning('Invalid Email Address');
          }
          if (this.getDisplayName(key) === 'Phone Number') {
            this.toastr.warning('Invalid Phone Number');
          }
        }
        if (errors['maxWords']) {
          const { actualWords, maxWords } = errors['maxWords'];
          this.toastr.warning(`Bio cannot exceed ${maxWords} words (current count: ${actualWords})`);
        }
      }
    });
  }

  // Custom validator for word count
  validateWordCount(maxWords: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) return null;
      const words = control.value.trim().split(/\s+/);
      return words.length > maxWords ? { maxWords: { actualWords: words.length, maxWords } } : null;
    };
  }

  // Subscribe to bio value changes to update word count
  subscribeToBioChanges() {
    const bioControl = this.addInfoForm.get('bio');
    bioControl?.valueChanges.subscribe(value => {
      this.bioWordCount = this.calculateWordCount(value);
    });
  }

  // Calculate word count
  calculateWordCount(text: string): number {
    return text ? text.trim().split(/\s+/).length : 0;
  }

  // Toggle visibility of custom pronouns input based on dropdown selection
  toggleCustomPronouns(event: any) {
    const selectedPronouns = event.target.value;
    this.showCustomPronounsInput = (selectedPronouns === 'custom');
  
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

  // Get display name for form field
  getDisplayName(key: string): string {
    const displayNames: { [key: string]: string } = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phoneNumber: 'Phone Number',
      dateOfBirth: 'Date Of Birth',
      street: 'Street',
      location: 'Location',
      bio: 'Bio',
      pronouns: 'Pronouns',
    };
    return displayNames[key] || key;
  }
}