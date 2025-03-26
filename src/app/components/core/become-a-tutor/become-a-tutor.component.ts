import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HandleDataService } from '../../../services/handleData.service';
import { TutorRegisterRoutes } from '../../../services/routes/core/become-a-tutor/tutorRegisterRoutes.service';
import { AccessGuardService } from '../../../guards/access.guard';

@Component({
  selector: 'app-become-a-tutor',
  templateUrl: './become-a-tutor.component.html',
  styleUrls: ['./become-a-tutor.component.scss']
})
export class BecomeATutorComponent implements OnInit {
  becomeATutorForm: FormGroup = new FormGroup({});
  isScreenLess = false;
  validSession = false;
  email: string | null = null;
  role: string | null = null;
  isTutor = false;
  testimonials: { name: string; testimonial: string; image: string; }[] = [];
  
  constructor(private toastr: ToastrService, private router: Router, private dataService: HandleDataService, private tutorRegService: TutorRegisterRoutes, private accessGuard: AccessGuardService) {}

  ngOnInit(): void {
    this.handleWindowResize();
    this.generateBlobs();
    this.handleUserData();
    this.initializeForm();
    this.testimonials = this.getRandomTestimonials(3);
  }

  getRandomTestimonials(count: number) {
    const shuffled = this.testimonials.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Listens to window resize event to handle changes in screen width
  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event) {
    this.handleWindowResize();
  }

  // Handles changes in window size
  private handleWindowResize() {
    if (window.innerWidth >= 992) {
      this.isScreenLess = true;
    } else { 
      this.isScreenLess = false;
    }
  }


  private generateBlobs() {
    // Select the blobs
    const blobs = document.querySelectorAll('.blob') as NodeListOf<HTMLElement>;

    // Loop through each blob and apply transformations
    blobs.forEach((blob) => {
        // Select the container
        const container = document.querySelector('.tutor-signup-container') as HTMLElement;

        // Check if container exists
        if (!container) {
          console.error('Container element not found');
          return;
        }

        // Get container dimensions
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        // Get blob dimensions
        const blobWidth = blob.offsetWidth;
        const blobHeight = blob.offsetHeight;

        // Generate random values for scale, rotation, and position
        const randomScale = 0.8 + Math.random() * 0.5; // Scale between 0.8 and 1.3
        const randomRotation = Math.random() * 360; // Rotate between 0 and 360 degrees

        // Calculate random translation offsets (keeping blobs within bounds)
        const maxTranslateX = (containerWidth - blobWidth * randomScale) / 2;
        const maxTranslateY = (containerHeight - blobHeight * randomScale) / 2;
        const randomTranslateX = Math.random() * maxTranslateX * 2 - maxTranslateX;
        const randomTranslateY = Math.random() * maxTranslateY * 2 - maxTranslateY;

        // Apply random transform values
        blob.style.transform = `
            scale(${randomScale}) 
            translate(${randomTranslateX}px, ${randomTranslateY}px) 
            rotate(${randomRotation}deg)`;
    });
  }

  // Handles user data from API
  handleUserData() {
    const userData = this.dataService.decodedToken();
    if (userData) {
      this.validSession = localStorage.getItem('session') !== null;
      this.email = userData.email;
      this.role = localStorage.getItem('role');

      // Update boolean flags
      this.isTutor = this.role?.includes('Tutor') ?? false;
    }

    this.tutorRegService.getTestimonials().subscribe((response) => {
      if (Array.isArray(response.testimonials)) {
        this.testimonials = response.testimonials.map((testimonial: any) => ({
          name: testimonial.tutorName,
          testimonial: testimonial.testimonial,
          image: `data:${testimonial.profileImage.contentType};base64,${testimonial.profileImage.data}`
        }));
      } else {
        console.error('Response does not contain an array of testimonials:', response);
      }
    });
  };

  // Initializes the form based on the current mode
  initializeForm() {
    this.becomeATutorForm = new FormGroup({
      email: new FormControl("", !this.validSession ? [Validators.required, Validators.pattern(/^[^@]+@[^@]+\.[^@]+$/)] : null),
    });
  }

  // Handles form submission
  onSubmit() {
    if (this.becomeATutorForm.valid) {
      const email = this.becomeATutorForm.get('email')?.value?.trim() ? this.becomeATutorForm.get('email')?.value : this.email;
      const sessionStatus = this.validSession;
      this.tutorRegService.checkUserByEmail({ email, sessionStatus }).subscribe((response) => {
        this.toastr.success(response.message);
        this.accessGuard.allowNavigation();
        this.router.navigate(['/become-a-tutor/register'], { queryParams: { email } });
      },
      (error) => {
        this.toastr.error(error.error.message);      
        if (error.status === 403 && !this.validSession) {
          setTimeout(() => {
            window.location.replace('/sign-in');
          }, 5000);
        } else {
          this.becomeATutorForm.reset();
        }    
      });
    } else {
      const formControls = this.becomeATutorForm.controls;

      Object.keys(formControls).forEach(key => {
        const control = formControls[key];
        if (control.invalid) {
          if (control.errors?.['required']) {
            this.toastr.error(`Email is required`);
          }
          if (control.errors?.['pattern']) {
            this.toastr.warning('Invalid Email Address');
          }
        }
      });
    }
  }
}
