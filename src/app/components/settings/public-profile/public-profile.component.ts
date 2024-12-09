import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { SettingsRoutesService } from '../../../services/routes/settingsRoutes.service';
import { HandleDataService } from '../../../services/handleData.service';

@Component({
  selector: 'app-account',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.scss']
})
export class PublicProfileComponent implements OnInit {
  editUserForm: FormGroup = new FormGroup({});
  userData: any;
  bio = '';
  pronouns = '';
  customPronouns = '';
  portfolioLink = '';
  socialLink1 = '';
  socialLink2 = '';
  projectOne: any;
  projectTwo: any;
  projectOneImage: string | ArrayBuffer | null = null;
  projectTwoImage: string | ArrayBuffer | null = null;
  file: File | null = null;
  projectOneDesWordCount: number = 0;
  projectTwoDesWordCount: number = 0;
  profileImage: string | null = null;
  photoEditability = false;
  bioWordCount: number = 0;
  maxWords: number = 50; // Define the maximum word count
  showCustomPronounsInput: boolean = false;

  private readonly FILE_SIZE_LIMIT = 2 * 1024 * 1024; // 2MB in bytes
  private readonly ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];


  // Mapping of social media domains to FontAwesome icons
  socialLogos = {
    instagram: 'fa-brands fa-instagram',
    twitter: 'fa-brands fa-twitter',
    facebook: 'fa-brands fa-facebook',
    linkedin: 'fa-brands fa-linkedin',
    youtube: 'fa-brands fa-youtube',
    reddit: 'fa-brands fa-reddit',
    default: 'fa-solid fa-link'
  };

  constructor(private location: Location, private settingsRoutes: SettingsRoutesService, private dataService: HandleDataService, 
              private renderer: Renderer2, private toastr: ToastrService) {}

  ngOnInit() {
    this.handleUserData(); // Initialize user data handling
    this.initializeForm(); // Initialize the user info form
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  }

  ngOnDestroy(): void {
    // Clean up listener
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  }

  private handleBeforeUnload = (event: BeforeUnloadEvent): void => {
    if (this.editUserForm.dirty) {
      event.preventDefault();
      event.returnValue = ''; // Required for some browsers
    }
  };

  // Handles user data from API
  handleUserData() {
    this.settingsRoutes.getPublicProfile().subscribe((response) => {
        this.userData = this.dataService.decodedToken(response);

        // Initialize fields with user data or default empty values
        const fields: { [key: string]: string } = { 
          bio: '', pronouns: '', portfolioLink: '', socialLink1: '', socialLink2: '',
        };
    
        Object.keys(fields).forEach(field => {
          (this as any)[field] = this.userData[field] || fields[field];
        });

        // Calculate initial word counts for bio and project descriptions
        this.bioWordCount = this.calculateWordCount(this.bio);

        // Show custom pronouns input if necessary
        this.showCustomPronounsInput = !['', 'he/him', 'she/her', 'they/them'].includes(this.pronouns);
        if (this.showCustomPronounsInput) {
          this.customPronouns = this.pronouns;
          this.pronouns = 'custom';
        }

        // Load profile image from local storage
        this.profileImage = localStorage.getItem('profileImage');
        
        // Initialize projects with user data or default empty values
        this.projectOne = this.userData.projectOne ? this.userData.projectOne : '';
        this.projectTwo = this.userData.projectTwo ? this.userData.projectTwo : '';

        // Load project images from user data
        this.projectOneImage = this.projectOne ? `data:${this.projectOne.img.contentType};base64,${this.projectOne.img.data}` : '';
        this.projectTwoImage = this.projectTwo ? `data:${this.projectTwo.img.contentType};base64,${this.projectTwo.img.data}` : '';

        // Calculate initial word counts for project descriptions
        this.projectOneDesWordCount = this.calculateWordCount(this.projectOne?.desc);
        this.projectTwoDesWordCount = this.calculateWordCount(this.projectTwo?.desc);

        this.initializeForm();          // Initialize the form after userData is available
        this.subscribeToBioChanges();   // Ensure subscription is added after initializing the form
      },
      (error) => {
        this.toastr.error(error.error.message);
      }
    );
  }

  // Initialize the form with form controls and validators
  initializeForm() {
    this.editUserForm = new FormGroup({
      userProfileBio: new FormControl(this.userData?.bio || '', this.validateWordCount(this.maxWords)),
      userProfilePronouns: new FormControl(this.pronouns || ''),
      userProfileCustomPronouns: new FormControl(this.customPronouns || '', this.customPronouns ? Validators.required : null),
      userProfilePortfolio: new FormControl(this.portfolioLink || ''),
      userProfileSocialLinkOne: new FormControl(this.socialLink1 || ''),
      userProfileSocialLinkTwo: new FormControl(this.socialLink2 || ''),
      userProfileProjectOne: new FormControl(this.projectOneImage),
      userProfileProjectOneName: new FormControl(this.projectOne?.name || '', this.projectOne ? Validators.required : null),
      userProfileProjectOneUrl: new FormControl(this.projectOne?.url || '', this.projectOne ? Validators.required : null),
      userProfileProjectOneDesc: new FormControl(this.projectOne?.desc || '', this.projectOne ? [Validators.required, this.validateWordCount(this.maxWords)] : null),
      userProfileProjectTwo: new FormControl(this.projectTwoImage),
      userProfileProjectTwoName: new FormControl(this.projectTwo?.name || '', this.projectTwo ? Validators.required : null),
      userProfileProjectTwoUrl: new FormControl(this.projectTwo?.url || '', this.projectTwo ? Validators.required : null),
      userProfileProjectTwoDesc: new FormControl(this.projectTwo?.desc || '', this.projectTwo ? [Validators.required, this.validateWordCount(this.maxWords)] : null)
    });
  }

  // Custom validator for checking the word count of a form control
  validateWordCount(maxWords: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) return null;
      const words = control.value.trim().split(/\s+/);
      return words.length > maxWords ? { maxWords: { actualWords: words.length, maxWords } } : null;
    };
  }

  // Subscribe to changes in specific form controls for dynamic word count updates
  subscribeToBioChanges() {
    const bioControl = this.editUserForm.get('userProfileBio');
    bioControl?.valueChanges.subscribe(value => {
      this.bioWordCount = this.calculateWordCount(value);
    });
    const projectOneContorl = this.editUserForm.get('userProfileProjectOneDesc');
    projectOneContorl?.valueChanges.subscribe(value => {
      this.projectOneDesWordCount = this.calculateWordCount(value);
    });
    const projectTwoContorl = this.editUserForm.get('userProfileProjectTwoDesc');
    projectTwoContorl?.valueChanges.subscribe(value => {
      this.projectTwoDesWordCount = this.calculateWordCount(value);
    });
  }

  // Helper method to calculate word count from a string
  calculateWordCount(text: string): number {
    return text ? text.trim().split(/\s+/).length : 0;
  }

  // Toggle visibility of custom pronouns input based on dropdown selection
  toggleCustomPronouns(event: any) {
    const selectedPronouns = event.target.value;
    this.showCustomPronounsInput = (selectedPronouns === 'custom');
  
    // Enable/disable customPronouns control based on selection
    if (selectedPronouns) {
      if (this.showCustomPronounsInput) {
        this.editUserForm.get('userProfileCustomPronouns')?.setValidators([Validators.required]);
      } else {
        this.editUserForm.get('userProfileCustomPronouns')?.clearValidators();
        this.editUserForm.patchValue({ userProfileCustomPronouns: '' });
      }
    }
    this.editUserForm.updateValueAndValidity();
  }

  // Determine which social media logo to show based on the link URL
  getLogo(url: string): string {
    if (url.includes('instagram.com')) return this.socialLogos.instagram;
    if (url.includes('twitter.com')) return this.socialLogos.twitter;
    if (url.includes('facebook.com')) return this.socialLogos.facebook;
    if (url.includes('linkedin.com')) return this.socialLogos.linkedin;
    if (url.includes('youtube.com')) return this.socialLogos.youtube;
    if (url.includes('reddit.com')) return this.socialLogos.reddit;
    return this.socialLogos.default;
  }

  // Open file input for selecting a new profile image
  onChange(projectNumber: number): void {
    const fileInput = document.querySelector(`input[type="file"][data-project="${projectNumber}"]`) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    } else {
      this.toastr.error(`File input for project ${projectNumber} not found.`);
    }
  }

  // Submit the updated user profile information
  onFileSelected(event: any, projectNumber: number): void {
    const file = event.target.files[0];
    if (file) {
      // Check file size
      if (file.size > this.FILE_SIZE_LIMIT) {
        this.toastr.warning('File size exceeds 2MB limit. Please select a smaller file.');
        return;
      }

      // Check file type
      if (!this.ALLOWED_FILE_TYPES.includes(file.type)) {
        this.toastr.warning('Invalid file type. Please select a JPEG or PNG image.');
        return;
      }

      // Store the file and read its data for preview
      this.file = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          if (projectNumber === 1) {
            this.projectOneImage = URL.createObjectURL(file); // Preview the image
            this.editUserForm.patchValue({ userProfileProjectOne: file });
            this.editUserForm.get('userProfileProjectOneName')?.setValidators([Validators.required]);
            this.editUserForm.get('userProfileProjectOneUrl')?.setValidators([Validators.required]);
            this.editUserForm.get('userProfileProjectOneDesc')?.setValidators([Validators.required]);
          } else if (projectNumber === 2) {
            this.projectTwoImage = URL.createObjectURL(file); // Preview the image
            this.editUserForm.patchValue({ userProfileProjectTwo: file });
            this.editUserForm.get('userProfileProjectTwoName')?.setValidators([Validators.required]);
            this.editUserForm.get('userProfileProjectTwoUrl')?.setValidators([Validators.required]);
            this.editUserForm.get('userProfileProjectTwoDesc')?.setValidators([Validators.required]);
          }
          this.editUserForm.updateValueAndValidity();
        }
      };
      reader.readAsDataURL(file);
    }
  }

  // Remove the selected file and update the form control
  onRemove(projectNumber: number): void {
    if (projectNumber === 1 && this.userData.projectOne === null) {
      this.projectOneImage = '';
      this.editUserForm.patchValue({ userProfileProjectOne: '', userProfileProjectOneName: '', userProfileProjectOneUrl: '', userProfileProjectOneDesc: '' });
      
      // Clear projectTwoImage if transferring its value to projectOneImage
      if (this.projectTwoImage) {
        this.projectOneImage = this.projectTwoImage;
        this.editUserForm.patchValue({
          userProfileProjectOne: this.editUserForm.get('userProfileProjectTwo')?.value || '',
          userProfileProjectOneName: this.editUserForm.get('userProfileProjectTwoName')?.value || '',
          userProfileProjectOneUrl: this.editUserForm.get('userProfileProjectTwoUrl')?.value || '',
          userProfileProjectOneDesc: this.editUserForm.get('userProfileProjectTwoDesc')?.value || ''
        });
        this.projectTwoImage = '';
        this.editUserForm.patchValue({ userProfileProjectTwo: '', userProfileProjectTwoName: '', userProfileProjectTwoUrl: '', userProfileProjectTwoDesc: '' });
        this.editUserForm.get('userProfileProjectTwoName')?.clearValidators();
        this.editUserForm.get('userProfileProjectTwoUrl')?.clearValidators();
        this.editUserForm.get('userProfileProjectTwoDesc')?.clearValidators();
      }
    } else if (projectNumber === 2 && this.userData.projectTwo === null) {
      this.projectTwoImage = '';
      this.editUserForm.patchValue({ userProfileProjectTwo: '', userProfileProjectTwoName: '', userProfileProjectTwoUrl: '', userProfileProjectTwoDesc: '' });
      this.editUserForm.get('userProfileProjectTwoName')?.clearValidators();
      this.editUserForm.get('userProfileProjectTwoUrl')?.clearValidators();
      this.editUserForm.get('userProfileProjectTwoDesc')?.clearValidators();
    } else {
      // Call the service to update the user profile
      this.settingsRoutes.removePublicProfileProject(projectNumber).subscribe(
        (response) => {
          this.toastr.success(response.message);
          setTimeout(() => {
            window.location.replace('/settings/profile');
          }, 1500);
        },
        (error) => {
          this.toastr.error(error.error.message);
        }
      );
    }

    this.editUserForm.updateValueAndValidity();

    const fileInput = document.querySelector(`input[type="file"][data-project="${projectNumber}"]`) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  // Toggles the edit mode for the profile image
  editPhoto(): void {
    this.photoEditability = !this.photoEditability;
    this.renderer.setStyle(document.body, 'overflow', this.photoEditability ? 'hidden' : '');
    this.renderer.setAttribute(document.body, 'scroll', this.photoEditability ? 'no' : '');
  }

  // Validate each form control and display warnings if invalid
  validateControls(controls: { [key: string]: AbstractControl }) {
    Object.keys(controls).forEach(key => {
      const control = controls[key];
      if (control.invalid) {
        const errors = control.errors || {};
        if (errors['required']) {
          if (key === 'userProfileCustomPronouns') { this.toastr.error('Pronouns is required'); }
          else if (key === 'userProfileProjectOneName' && this.projectOneImage) { this.toastr.error('Project One Name is required'); }
          else if (key === 'userProfileProjectOneUrl' && this.projectOneImage) { this.toastr.error('Project One Link is required'); }
          else if (key === 'userProfileProjectOneDesc' && this.projectOneImage) { this.toastr.error('Project One Description is required'); }
          else if (key === 'userProfileProjectTwoName' && this.projectTwoImage) { this.toastr.error('Project Two Name is required'); }
          else if (key === 'userProfileProjectTwoUrl' && this.projectTwoImage) { this.toastr.error('Project Two Link is required'); }
          else if (key === 'userProfileProjectTwoDesc' && this.projectTwoImage) { this.toastr.error('Project Two Description is required'); }
        }
        if (errors['maxWords']) {
          const { actualWords, maxWords } = errors['maxWords'];
          // Customize warning messages for specific controls
          if (key === 'userProfileBio') {
            this.toastr.warning(`Bio cannot exceed ${maxWords} words (current count: ${actualWords})`);
          } else if (key === 'userProfileProjectOneDesc') {
            this.toastr.warning(`Project One Description cannot exceed ${maxWords} words (current count: ${actualWords})`);
          } else if (key === 'userProfileProjectTwoDesc') {
            this.toastr.warning(`Project Two Description cannot exceed ${maxWords} words (current count: ${actualWords})`);
          }
        }
      }
    });
  }

  // Submit the updated user information
  submitNewUserInfo() {
    if (this.editUserForm.valid) {
      this.editUserForm.markAsPristine(); // Reset the dirty state
      // Create a FormData object
      const formData = new FormData();
  
      // Add text fields to FormData
      const formValues = this.editUserForm.value;
      formData.append('bio', formValues.userProfileBio || '');
      formData.append('pronouns', formValues.userProfilePronouns === 'custom' ? formValues.userProfileCustomPronouns : formValues.userProfilePronouns || '');
      formData.append('portfolioLink', formValues.userProfilePortfolio || '');
      formData.append('socialLink1', formValues.userProfileSocialLinkOne || '');
      formData.append('socialLink2', formValues.userProfileSocialLinkTwo || '');
  
      // Add project data to FormData if they exist
      if (this.projectOneImage) {
        const file: File = this.editUserForm.value.userProfileProjectOne;
        formData.append('projectOneImage', file);
        formData.append('projectOneName', formValues.userProfileProjectOneName || '');
        formData.append('projectOneUrl', formValues.userProfileProjectOneUrl || '');
        formData.append('projectOneDesc', formValues.userProfileProjectOneDesc || '');
      }
  
      if (this.projectTwoImage) {
        const file: File = this.editUserForm.value.userProfileProjectTwo;
        formData.append('projectTwoImage', file);
        formData.append('projectTwoName', formValues.userProfileProjectTwoName || '');
        formData.append('projectTwoUrl', formValues.userProfileProjectTwoUrl || '');
        formData.append('projectTwoDesc', formValues.userProfileProjectTwoDesc || '');
      }
  
      // Call the service to update the user profile
      this.settingsRoutes.updatePublicProfile(formData).subscribe(
        (response) => {
          this.toastr.success(response.message);
          setTimeout(() => {
            window.location.replace('/settings/profile');
          }, 1500);
        },
        (error) => {
          this.toastr.error(error.error.message);
        }
      );
    } else {
      this.validateControls(this.editUserForm.controls);
    }
  }
}