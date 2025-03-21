import { Component, OnInit, Renderer2, HostListener, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { HandleDataService } from '../../../../services/handleData.service';
import { PublicProfileRoutes } from '../../../../services/routes/settings/publicProfileRoutes.service';
import { TutorRegisterRoutes } from '../../../../services/routes/core/become-a-tutor/tutorRegisterRoutes.service';

@Component({
  selector: 'app-tutor-registration',
  templateUrl: './tutor-registration.component.html',
  styleUrls: ['./tutor-registration.component.scss']
})
export class TutorRegistrationComponent implements OnInit {
  currentStep = 0;
  validSession = false;
  tutorRegisterForm: FormGroup = new FormGroup({});
  fullName: string = '';
  email: string = '';
  passwordVisible: boolean = false;
  showPasswordIcon: string = 'fa-eye-slash';
  userData: any;
  bio = '';
  pronouns = '';
  customPronouns = '';
  bioWordCount: number = 0;
  maxWords: number = 50; // Define the maximum word count
  minWords: number = 5;// Define the minimum word count
  showCustomPronounsInput: boolean = false;
  profileImage: File | null = null;
  profileImageUrl: string | null = null;
  photoEditability = false;
  daysOfWeek = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
  selectedDays: string[] = []; // List of selected days
  timeSlots: string[] = []; // List of selected times
  debounceTimer: any;
  subjects: string[] = [];
  filteredSubjects: string[] = [];
  selectedSubjects: string[] = []; // List of selected subjects
  subjectCurrentFocus = -1;
  languages: string[] = [];
  filteredLanguages: string[] = [];
  selectedLanguages: string[] = []; // List of selected languges
  languageCurrentFocus = -1;
  selectedVideo: File | null = null; // Store the selected video file
  videoPreviewUrl: string | null = null; // URL for video preview
  videoDuration: number = 0;
  isEditable: boolean = false;
  reviewPasswordVisible: boolean = false;
  reviewShowPasswordIcon: string = 'fa-eye-slash';
  
  private readonly FILE_SIZE_LIMIT = 100 * 1024 * 1024; // 100MB in bytes
  private readonly ALLOWED_FILE_TYPES = ['video/mp4', 'video/mov', 'video/avi'];

  @ViewChild('subjectInput') subjectInputElement!: ElementRef;
  @ViewChild('languageInput') languageInputElement!: ElementRef;
  @ViewChild('subjectsContainer') subjectsContainer!: ElementRef;  
  @ViewChild('languagesContainer') languagesContainer!: ElementRef;

  constructor(private renderer: Renderer2, private route: ActivatedRoute, private router: Router, private toastr: ToastrService, private dataService: HandleDataService, 
              private publicProfileRoutes: PublicProfileRoutes, private tutorRegService: TutorRegisterRoutes) {
  }

  ngOnInit() {
    this.handleUserData();
    this.initializeForm();
    this.initializeTimeSlots();
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  }

  ngOnDestroy(): void {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  }

  private handleBeforeUnload = (event: BeforeUnloadEvent): void => {
    if (this.tutorRegisterForm.dirty) {
      event.preventDefault();
      event.returnValue = ''; // Required for some browsers
    }
  };

  // Handles user data from API
  handleUserData() {
    this.publicProfileRoutes.getPublicProfile().subscribe((response) => {
        this.userData = this.dataService.decodedToken(response);

        const profileData = this.dataService.decodedToken();
        if (profileData) {
          this.fullName = profileData.fullName;
        }

        // Initialize fields with user data or default empty values
        const fields: { [key: string]: string } = { 
          bio: '', pronouns: '', portfolioLink: ''
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
        const storedImage = localStorage.getItem('profileImage');
        if (storedImage) {
          this.profileImage = this.dataURLtoFile(storedImage, 'profile.png');
          this.profileImageUrl = storedImage; // Use base64 directly for rendering
        }

        this.validSession = localStorage.getItem('session') !== null;
        if (this.validSession) { this.currentStep++; }

        this.initializeForm();          // Initialize the form after userData is available
      },
      (error) => {
        this.profileImageUrl = "../../../assets/default-profile.png";
      }
    );

    this.tutorRegService.getSubjects().subscribe((response) => {
      if (response && response.subjects && Array.isArray(response.subjects)) {
        // Map over the subjects array and extract the 'name' property for each subject
        this.subjects = response.subjects.map((subject: { name: any; }) => subject.name);
      } else {
        console.error('Unexpected response structure:', response);
      }
    });

    this.tutorRegService.getLanguages().subscribe((response) => {
      if (response && response.languages && Array.isArray(response.languages)) {
        // Map over the languages array and extract the 'name' property for each language
        this.languages = response.languages.map((language: { name: any; }) => language.name);
      } else {
        console.error('Unexpected response structure:', response);
      }
    });
  }

  // Initializes the form based on the current mode
  initializeForm() {
    this.route.queryParams.subscribe(params => { this.email = params['email']; });
    this.tutorRegisterForm = new FormGroup({
      fullName: new FormControl("", [Validators.required, Validators.pattern(/^(\w\w+)\s(\w+)$/)]),
      email: new FormControl({ value: this.email, disabled: true }),
      password: new FormControl("", [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)]),

      userProfileBio: new FormControl(this.userData?.bio || '', [Validators.required, this.validateWordCount(this.minWords, this.maxWords)]),
      userProfilePronouns: new FormControl(this.pronouns || '', Validators.required),
      userProfileCustomPronouns: new FormControl(this.customPronouns || '', this.customPronouns ? Validators.required : null),
      profileImage: new FormControl(this.profileImage, [Validators.required, this.profileImageValidator()]),

      days: new FormGroup(
        this.daysOfWeek.reduce((days: { [key: string]: FormControl }, day: string) => {
          days[day] = new FormControl(false); // Each day starts unchecked
          return days;
        }, {}), [this.validateAvailability()] 
      ),
      ...this.daysOfWeek.reduce((controls: { [key: string]: FormControl }, day: string) => {
        controls[day + 'Start'] = new FormControl({ value: '', disabled: true });
        controls[day + 'End'] = new FormControl({ value: '', disabled: true });
        return controls;
      }, {}),
      subjects: new FormControl('', [this.validateSubjectsSelected()]),
      hourlyRate: new FormControl('', [this.validateHourlyRate()]),
      teachingMode: new FormControl('', Validators.required),
      languages: new FormControl('', [this.validateLanguagesSelected()]),
      videoVerification: new FormControl('', Validators.required)
    }, { validators: this.validateTimeSlots() });

    this.subscribeToBioChanges();   // Ensure subscription is added after initializing the form

    // Enable/disable time slot controls based on day selection
    this.tutorRegisterForm.get('days')?.valueChanges.subscribe(days => {
      this.daysOfWeek.forEach(day => {
      const startControl = this.tutorRegisterForm.get(day + 'Start');
      const endControl = this.tutorRegisterForm.get(day + 'End');
      if (days[day]) {
        startControl?.enable({ emitEvent: false });
        endControl?.enable({ emitEvent: false });
        startControl?.setValidators(Validators.required);
        endControl?.setValidators(Validators.required);
      } else {
        startControl?.disable({ emitEvent: false });
        endControl?.disable({ emitEvent: false });
        startControl?.clearValidators();
        endControl?.clearValidators();
      }
      startControl?.updateValueAndValidity({ emitEvent: false });
      endControl?.updateValueAndValidity({ emitEvent: false });
      });
    });
  }

  // -------------------------------- STEP 0 --------------------------------

  // Toggles the visibility of the password field
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
    this.showPasswordIcon = this.passwordVisible ? 'fa-eye' : 'fa-eye-slash';
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    if (passwordInput) {
      passwordInput.type = this.passwordVisible ? 'text' : 'password';
    }
  }

  // -------------------------------- STEP 0 --------------------------------

  // -------------------------------- STEP 1 --------------------------------

  // Custom validator for checking the word count of a form control
  validateWordCount(minWords: number, maxWords: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value || typeof control.value !== 'string') { return null; }  
      const wordCount = control.value.trim().split(/\s+/).length;
      if (wordCount < minWords) { return { minWords: { requiredMin: minWords, actual: wordCount } }; }
      if (wordCount > maxWords) { return { maxWords: { requiredMax: maxWords, actual: wordCount } }; }
      return null; // Valid input
    };
  }
 // Subscribe to changes in specific form controls for dynamic word count updates
  subscribeToBioChanges() {
    const bioControl = this.tutorRegisterForm.get('userProfileBio');
    bioControl?.valueChanges.subscribe(value => {
      this.bioWordCount = this.calculateWordCount(value);
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
        this.tutorRegisterForm.get('userProfileCustomPronouns')?.setValidators([Validators.required]);
      } else {
        this.tutorRegisterForm.get('userProfileCustomPronouns')?.clearValidators();
        this.tutorRegisterForm.patchValue({ userProfileCustomPronouns: '' });
      }
    }
    this.tutorRegisterForm.updateValueAndValidity();
  }

  // Custom validator for profile image field
  profileImageValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return control.value ? null : { 'profileImageRequired': true };
    };
  }

  // Method to handle the selected image
  onImageSelected(file: File) {
    this.profileImage = file;
    
    // Convert file to object URL for display
    this.profileImageUrl = URL.createObjectURL(file);
    this.tutorRegisterForm.patchValue({ profileImage: file });

    // Convert to base64 and store in local storage
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      localStorage.setItem('profileImage', reader.result as string);
    };
  }

  // Toggles the edit mode for the profile image
  editPhoto(): void {
    this.photoEditability = !this.photoEditability;
    this.renderer.setStyle(document.body, 'overflow', this.photoEditability ? 'hidden' : '');
    this.renderer.setAttribute(document.body, 'scroll', this.photoEditability ? 'no' : '');
  }

  // Helper function to convert base64 to File object
  dataURLtoFile(dataUrl: string, filename: string): File {
    const arr = dataUrl.split(','), 
          mime = arr[0].match(/:(.*?);/)![1],
          bstr = atob(arr[1]), 
          n = bstr.length, 
          u8arr = new Uint8Array(n);

    for (let i = 0; i < n; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    
    return new File([u8arr], filename, { type: mime });
  }

  // -------------------------------- STEP 1 --------------------------------

  // -------------------------------- STEP 2 --------------------------------

  // Handles the change event when a day is selected or deselected.
  onDaySelectionChange(day: string): void {
    const index = this.selectedDays.indexOf(day);
    
    if (index > -1) {
      this.selectedDays.splice(index, 1);
    } else {
      this.selectedDays.push(day);
    }
  
    // Sort selectedDays based on the order of daysOfWeek
    this.selectedDays.sort((a, b) => this.daysOfWeek.indexOf(a) - this.daysOfWeek.indexOf(b));
  }

  // Method to check if any day is selected
  isAnyDaySelected(): boolean {
    const daysControl = this.tutorRegisterForm.get('days');
    return daysControl ? Object.values(daysControl.value).some(value => value) : false;
  }

  // Custom validator for checking the user has selected at least two days of availability 
  validateAvailability(): ValidatorFn {
    return (group: AbstractControl): { [key: string]: any } | null => {
      const daysGroup = group.value;
      const selectedDays = Object.values(daysGroup).filter(selected => selected === true).length;
      return selectedDays >= 2 ? null : { noDaysSelected: true };
    };
  }

  // Initializes the time slots from 8 AM to 8 PM
  initializeTimeSlots() {
    const startHour = 8;
    const endHour = 20;
    for (let hour = startHour; hour <= endHour; hour++) {
      const time = hour < 12 ? `${hour} AM` : `${hour === 12 ? 12 : hour - 12} PM`;
      this.timeSlots.push(time);
    }
  }

  // Helper method to convert 12-hour format to 24-hour format
  convertTo24HourFormat(time: string): number {
    const [hour, period] = time.split(' ');
    let [hours, minutes] = hour.split(':').map(Number);

    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    return hours * 60 + (minutes || 0);
  }

  // Custom validator for checking the selected time slots
  validateTimeSlots(): ValidatorFn {
    return (group: AbstractControl): { [key: string]: any } | null => {
      const controls = (group as FormGroup).controls;
      let isValid = true;

      this.daysOfWeek.forEach(day => {
        const startControl = controls[day + 'Start'];
        const endControl = controls[day + 'End'];

        if (startControl && endControl) {
          const startTime = startControl.value;
          const endTime = endControl.value;

          if (!startTime || !endTime) {
            isValid = false;
            startControl.setErrors({ required: true });
            endControl.setErrors({ required: true });
          } else {
            const startMinutes = this.convertTo24HourFormat(startTime);
            const endMinutes = this.convertTo24HourFormat(endTime);

            if (startMinutes >= endMinutes) {
              isValid = false;
              startControl.setErrors({ invalidTime: true });
              endControl.setErrors({ invalidTime: true });
            } else {
              const selectedHours = (endMinutes - startMinutes) / 60;
              if (selectedHours < 4) {
                isValid = false;
                startControl.setErrors({ minHours: true });
                endControl.setErrors({ minHours: true });
              } else {
                startControl.setErrors(null);
                endControl.setErrors(null);
              }
            }
          }
        }
      });

      return isValid ? null : { invalidTimeSlots: true };
    };
  }

  // Handles user input with a debounce timer for better performance
  onSubjectInput(event: any): void {
    clearTimeout(this.debounceTimer); // Clear the previous timer
    const value = event.target.value.trim().toLowerCase();
    this.debounceTimer = setTimeout(() => { // Start a new timer
      this.filteredSubjects = value
        ? this.subjects.filter((subject) =>
            subject.toLowerCase().includes(value)
          )
        : [];
      this.subjectCurrentFocus = -1;
    }, 300); // Delay of 300ms
  }

  // Show the autocomplete menu when the input field is focused
  onSubjectFocus(): void {
    this.filteredSubjects = this.subjects.slice().sort((a, b) => a.localeCompare(b)); // Show all subjects initially in alphabetical order
    this.subjectCurrentFocus = -1;
  }

  // Handles keyboard navigation for the autocomplete dropdown
  onSubjectKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeSubjectList();
      this.clearSubjectInput();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      
      if (this.subjectCurrentFocus > -1) {
        this.selectSubject(this.filteredSubjects[this.subjectCurrentFocus]);
      } else {
        const value = this.subjectInputElement.nativeElement.value.trim();
        if (value) {
          this.selectSubject(value); // Add the new subject
          this.clearSubjectInput();
        }
      }
    }
  }

  // Highlights the currently focused autocomplete item and scrolls it into view
  setActiveSubjectItem(): void {
    const items = this.subjectInputElement.nativeElement.parentElement.querySelectorAll('.autocomplete-item');
    items.forEach((item: HTMLElement, index: number) => {
      item.classList.toggle('autocomplete-active', index === this.subjectCurrentFocus);
      if (index === this.subjectCurrentFocus) {
        item.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    });
  }

  // Adds the selected subject to the list if not already selected
  selectSubject(subject: string): void {
    if (!this.selectedSubjects.includes(subject)) {
      this.selectedSubjects.push(subject);
    }
    this.selectedSubjectsChanged();
  }

  // Clears input if a click occurs outside the component
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent): void {
    if (this.currentStep === 2) {
      const target = event.target as HTMLElement;
      if (!this.subjectsContainer.nativeElement.contains(target)) {
        this.clearSubjectInput(); // Clear input if the click is outside the container
      }
      if (!this.languagesContainer.nativeElement.contains(target)) {
        this.clearLanguageInput(); // Clear input if the click is outside the container
      }
    }
  }

  // Clears the input value and filtered suggestions
  clearSubjectInput(): void {
    this.subjectInputElement.nativeElement.value = ''; // Clear the input value
    this.filteredSubjects = []; // Clear filtered suggestions
  }

  // Removes a selected subject from the list
  removeSubject(subject: string): void {
    this.selectedSubjects = this.selectedSubjects.filter((item) => item !== subject);
    this.selectedSubjectsChanged();
  }

  // Closes the autocomplete dropdown and resets focus
  closeSubjectList(): void {
    this.filteredSubjects = [];
    this.subjectCurrentFocus = -1; // Reset focus index
  }

  // Updates the validation status of 'subjects' when the selectedSubjects array changes
  selectedSubjectsChanged() {
    if (this.selectedSubjects.length >= 2) {
      // If there are at least 4 subjects, set the subjects control as valid
      this.tutorRegisterForm.get('subjects')?.setErrors(null);
      this.tutorRegisterForm.get('subjects')?.updateValueAndValidity();
    } else {
      // Otherwise, apply the minSubjects error
      this.tutorRegisterForm.get('subjects')?.setErrors({ minSubjects: true });
      this.tutorRegisterForm.get('subjects')?.updateValueAndValidity();
    }
  }

  // Custom validator to check that at least 2 subjects are selected
  validateSubjectsSelected(): ValidatorFn {
    return (): { [key: string]: any } | null => {
      return this.selectedSubjects.length >= 2 ? null : { minSubjects: true };
    };
  }

  // Custom validator to check that the hourly rate is between 5 and 999
  validateHourlyRate(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value !== null && (isNaN(value) || value < 20 || value > 999)) {
        return { notInRange: true }; // Error key
      }
      return null; // Valid input
    };
  }

  // Handles user input with a debounce timer for better performance
  onLanguageInput(event: any): void {
    clearTimeout(this.debounceTimer); // Clear the previous timer
    const value = event.target.value;
    this.debounceTimer = setTimeout(() => { // Start a new timer
      this.filteredLanguages = value
        ? this.languages.filter((language) =>
            language.toLowerCase().includes(value)
          )
        : [];
      this.languageCurrentFocus = -1;
    }, 300); // Delay of 300ms
  }

  // Show the autocomplete menu when the input field is focused
  onLanguageFocus(): void {
    this.filteredLanguages = this.languages.slice().sort((a, b) => a.localeCompare(b)); // Show all languages initially in alphabetical order
    this.languageCurrentFocus = -1;
  }

  // Handles keyboard navigation for the autocomplete dropdown
  onLanguageKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeLanguageList();
      this.clearLanguageInput();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      
      if (this.languageCurrentFocus > -1) {
        this.selectLanguage(this.filteredLanguages[this.languageCurrentFocus]);
      } else {
        const value = this.languageInputElement.nativeElement.value.trim();
        if (value) {
          this.selectLanguage(value); // Add the new language
          this.clearLanguageInput();
        }
      }
    }
  }

  // Highlights the currently focused autocomplete item and scrolls it into view
  setActiveLanguageItem(): void {
    const items = this.languageInputElement.nativeElement.parentElement.querySelectorAll('.autocomplete-item');
    items.forEach((item: HTMLElement, index: number) => {
      item.classList.toggle('autocomplete-active', index === this.languageCurrentFocus);
      if (index === this.languageCurrentFocus) {
        item.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    });
  }

  // Adds the selected language to the list if not already selected
  selectLanguage(language: string): void {
    if (!this.selectedLanguages.includes(language)) {
      this.selectedLanguages.push(language);
    }
    this.selectedLanguagesChanges();
  }

  // Clears the input value and filtered suggestions
  clearLanguageInput(): void {
    this.languageInputElement.nativeElement.value = ''; // Clear the input value
    this.filteredLanguages = []; // Clear filtered suggestions
  }

  // Removes a selected language from the list
  removeLanguage(language: string): void {
    this.selectedLanguages = this.selectedLanguages.filter((item) => item !== language);
    this.selectedLanguagesChanges();
  }

  // Closes the autocomplete dropdown and resets focus
  closeLanguageList(): void {
    this.filteredLanguages = [];
    this.languageCurrentFocus = -1; // Reset focus index
  }

  // Updates the validation status of 'languages' when the selectedLanguages array changes
  selectedLanguagesChanges() {
    if (this.selectedLanguages.length >= 1) {
      this.tutorRegisterForm.get('languages')?.setErrors(null);
      this.tutorRegisterForm.get('languages')?.updateValueAndValidity();
    } else {
      this.tutorRegisterForm.get('languages')?.setErrors({ minLanguages: true });
      this.tutorRegisterForm.get('languages')?.updateValueAndValidity();
    }
  }

  // Custom validator to check that at least 1 language is selected
  validateLanguagesSelected(): ValidatorFn {
    return (): { [key: string]: any } | null => {
      return this.selectedLanguages.length >= 1 ? null : { minLanguages: true };
    };
  }

  // Handles global keydown events for both subjects and languages
  @HostListener('window:keydown', ['$event'])
  handleGlobalKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();

      if (this.currentStep === 2) {
        // Check if the user is currently typing in either the subject or language input field
        const isTypingInSubject = document.activeElement === this.subjectInputElement?.nativeElement;
        const isTypingInLanguage = document.activeElement === this.languageInputElement?.nativeElement;

        if (!isTypingInSubject && !isTypingInLanguage) {
          this.next(); // Proceed to the next step if not typing
        }
      } else {
        this.next();
      }
    }
  }

  // -------------------------------- STEP 2 --------------------------------

  // -------------------------------- STEP 3 --------------------------------

  // Triggered when the user selects a video file
  onVideoUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
  
      // Check file size
      if (file.size > this.FILE_SIZE_LIMIT) {
        this.toastr.warning('File size exceeds 100MB limit. Please select a smaller file.');
        return;
      }

      // Check file type
      if (!this.ALLOWED_FILE_TYPES.includes(file.type)) {
        this.toastr.warning('Invalid file type. Please select an MP4, MOV, or AVI video.');
        return;
      }
  
      // Set selected video
      this.selectedVideo = file;
      this.videoPreviewUrl = URL.createObjectURL(file);

      // Create a video element to check duration
      const videoElement = document.createElement('video');
      videoElement.src = this.videoPreviewUrl;
      videoElement.preload = "metadata";

      videoElement.onloadedmetadata = () => {
        this.videoDuration = videoElement.duration;

        // Update validator for videoVerification field
        this.tutorRegisterForm.get('videoVerification')?.setValidators([this.validateVideoDuration()]);
        this.tutorRegisterForm.get('videoVerification')?.updateValueAndValidity();
      };
    } else {
      this.selectedVideo = null;
      this.videoPreviewUrl = null;
    }
  }

  // Custom validator to check the video duration
  validateVideoDuration(): ValidatorFn {
    return (): { [key: string]: any } | null => {
      return this.videoDuration >= 30 && this.videoDuration <= 61 ? null : { durationRange: true };
    };
  }

  // -------------------------------- STEP 3 --------------------------------

  // -------------------------------- STEP 4 --------------------------------

  // Navigates to a specific step in the registration process if the current step is valid.
  goToStep(step: number) {
    if (this.validateCurrentStep()) {
      if (this.currentStep < 4 || step < 4) {
        this.currentStep = step;
        this.isEditable = true;
      }
    } else {
      this.toastr.warning('Please ensure all required fields are correctly filled out before proceeding to the next step.');
    }
  }  

  // Toggles the visibility of the review password field.
  toggleReviewPasswordVisibility() {
    this.reviewPasswordVisible = !this.reviewPasswordVisible;
    this.reviewShowPasswordIcon = this.reviewPasswordVisible ? 'fa-eye-slash' : 'fa-eye';
  }

  // -------------------------------- STEP 4 --------------------------------

  // Validates the fields for the current step and shows error messages if invalid
  validateCurrentStep(): boolean {
    const formControls = this.tutorRegisterForm.controls;
    let isValid = true;
  
    const showError = (key: string, errorType: string, message: string) => {
      if (formControls[key].errors?.[errorType]) {
        this.toastr.error(message);
        isValid = false;
      }
    };
  
    const showWarning = (key: string, errorType: string, message: string) => {
      if (formControls[key].errors?.[errorType]) {
        this.toastr.warning(message);
        isValid = false;
      }
    };
  
    Object.keys(formControls).forEach(key => {
      const control = formControls[key];
      if (control.invalid) {
        switch (this.currentStep) {
          case 0:
            if (['fullName', 'password'].includes(key)) {
              showError(key, 'required', `${this.getDisplayName(key)} is required`);
              showWarning(key, 'pattern', 
                this.getDisplayName(key) === 'Full Name'
                  ? 'Full Name must include first name followed by last name. i.e John Smith'
                  : 'Password must be at least 6 characters long and include at least one digit, one lowercase letter, and one uppercase letter'
              );
              showWarning(key, 'minlength', 'Password must be at least 6 characters long');
            }
            break;
          case 1:
            if (['userProfileBio', 'userProfilePronouns', 'userProfileCustomPronouns', 'profileImage'].includes(key)) {
              showError(key, 'required', `${this.getDisplayName(key)} is required`);
              showWarning(key, 'maxWords', `Bio must not exceed ${control.errors?.['maxWords']?.requiredMax} words. You have ${control.errors?.['maxWords']?.actual}.`);
              showWarning(key, 'minWords', `Bio must have at least ${control.errors?.['minWords']?.requiredMin} words. You have ${control.errors?.['minWords']?.actual}.`);
            }
            break;
          case 2:
            if (key === 'days') {
              showError(key, 'noDaysSelected', 'Please select at least two day for your availability.');
            }
            if (key.endsWith('Start') || key.endsWith('End')) {
              showError(key, 'required', 'Both start and end times are required.');
              showWarning(key, 'invalidTime', 'End time must be later than start time.');
              showWarning(key, 'minHours', 'You must select at least 4 hours.');
            }
            if (key === 'subjects') {
              if (this.selectedSubjects.length < 2) {
                showError(key, 'minSubjects', 'Please select at least 2 subjects.');
              }
            }
            if (key === 'hourlyRate') {
              showError(key, 'notInRange', 'Hourly rate must be between 20 and 999.');
            }
            if (key === 'teachingMode') {
              showError(key, 'required', 'Please select a teaching mode.');
            }
            if (key === 'languages') {
              if (this.selectedLanguages.length < 1) {
                showError(key, 'minLanguages', 'Please select at least 1 language.');
              }
            }
            break;
          case 3:
            if (key === 'videoVerification') {
              showError(key, 'required', 'Please upload a verification video');
              showWarning(key, 'durationRange', 'Please upload a video that is between 30 and 60 seconds long.');
            }
        }
      }
    });
  
    const stepValidation: { [key: number]: () => boolean } = {
      0: () => formControls['fullName'].valid && formControls['password'].valid,
      1: () => formControls['userProfileBio'].valid && (formControls['userProfilePronouns'].valid || formControls['userProfileCustomPronouns'].valid),
      2: () => formControls['days'].valid && formControls['subjects'].valid && formControls['hourlyRate'].valid && formControls['teachingMode'].valid && formControls['languages'].valid,
      3: () => formControls['videoVerification'].valid,
      4: () => true, // Add specific validations for step 4 if required
    };
    
    return stepValidation[this.currentStep]() && isValid;
  }

  // Maps form control keys to display names for error messages
  getDisplayName(key: string): string {
    const displayNames: { [key: string]: string } = {
      fullName: 'Full Name',
      password: 'Password',
      userProfileBio: 'Bio',
      userProfilePronouns: 'Pronouns',
      userProfileCustomPronouns: 'Pronouns',
      profileImage: 'Profile Image',
    };
    return displayNames[key] || key;
  }

  // Cancels the registration process and navigates to the "become a tutor" page.
  cancel() {
    this.toastr.warning('Registration process has been cancelled.');
    this.router.navigate(['/become-a-tutor']);
  }

  // Proceeds to the next step in the registration process if the current step is valid.
  next() {
    if (this.validateCurrentStep()) {
      if (this.currentStep < 4) this.currentStep++;
    } else {
      this.toastr.warning('Please ensure all required fields are correctly filled out before proceeding to the next step.');
    }
  }

  // Goes back to the previous step in the registration process.
  previous() {
    if (this.currentStep > 0) this.currentStep--;
  }

  // Submits the form and triggers the registration process.
  onSubmit() {
    // Remove the beforeunload event listener
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    
    this.toastr.warning(' Please don’t reload or leave the page. You will be redirected once the process is complete.');

    const formData = new FormData();
    const formValues = this.tutorRegisterForm.value;

    const availability: { [key: string]: { start: string; end: string } } = {};
    this.selectedDays.forEach(day => {
      availability[day] = {
        start: formValues[day + 'Start'] || '',
        end: formValues[day + 'End'] || ''
      };
    });
    
    formData.append('fullName', formValues.fullName || this.fullName);
    formData.append('email', this.email || '');
    formData.append('password', formValues.password || '');
    formData.append('bio', formValues.userProfileBio || '');
    formData.append('pronouns', formValues.userProfilePronouns === 'custom' ? formValues.userProfileCustomPronouns : formValues.userProfilePronouns || '');
    formData.append('file', this.profileImage as File);
    formData.append('availability', JSON.stringify(availability));
    formData.append('subjects', JSON.stringify(this.selectedSubjects));
    formData.append('hourlyRate', formValues.hourlyRate);
    formData.append('teachingMode', formValues.teachingMode);
    formData.append('languages', JSON.stringify(this.selectedLanguages));
    formData.append('video', this.selectedVideo as File);


    this.tutorRegService.upload(formData).subscribe((response) => {
        this.toastr.success(response.message);
        this.tutorRegService.createNewTutor(formData).subscribe((response) => {
            this.toastr.success(response.message);
            if(response.status === 202) {
              setTimeout(() => {
                window.location.replace('/sign-in');
              }, 3000);
            } else {
              setTimeout(() => {
                this.router.navigate(['/']);
              }, 3000);
            }
          },
          (error) => {
            this.toastr.error(error.error.message || 'File upload failed.');
          }
        );
      },
      (error) => {
        this.toastr.error(error.error.message || 'File upload failed.');
      }
    );
  }
}
