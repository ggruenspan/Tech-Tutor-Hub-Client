import { Component, HostListener, Renderer2, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageService } from './services/localStorage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Tech Tutor Hub';
  isOpened = false;
  isScrolled = false;
  scrollThreshold: number = 100;
  isScreenLess = false;

  constructor(private renderer: Renderer2, private LocalStorageService: LocalStorageService) { }

  ngOnInit() {
    this.handleWindowResize(); // Initialize window resize handling
    this.handleUserData();
  }

  // Toggle the menu open or closed
  toggleMenu() {
    if (this.isOpened) {
      setTimeout(() => {
        this.isOpened = false;
      }, 350); // Delay to close the menu with animation
    } else {
      this.isOpened = true;
    }
  }

  // Listens to window scroll event to determine if the page is scrolled
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.scrollY;

    if (scrollPosition > this.scrollThreshold) {
      this.isScrolled = true;
    } else {
      this.isScrolled = false;
    }
  }

  // Listens to window resize event to handle changes in screen width
  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event) {
    this.handleWindowResize();
  }

  // Handles changes in window size, and close the menu if it's open on larger screens
  private handleWindowResize() {
    if (window.innerWidth >= 992 && this.isOpened) {
      this.isOpened = false;
      this.isScreenLess = false;
      const element = document.getElementById('navbarNav');
      this.renderer.removeClass(element, 'show'); // Remove 'show' class to hide the menu
    }

    if (window.innerWidth <= 750) {
      this.isScreenLess = true;
    } else {
      this.isScreenLess = false;
    }
  }

  private handleUserData() {
    try {
        const token = this.LocalStorageService.get('jwtToken');
        const helper = new JwtHelperService();
        if (token) {
          const decodedToken = helper.decodeToken(token)
            if (decodedToken.exp * 1000 > (Date.now()+ (60 * 60 * 1000))) {
              // console.log("alive");
              this.LocalStorageService.set('userName', decodedToken.userName);
              this.LocalStorageService.set('session', 'true');
            } else {
                // console.log("dead");
                this.LocalStorageService.remove('jwtToken');
                this.LocalStorageService.remove('userName');
                this.LocalStorageService.remove('session');
                this.router.navigate(['/']);
            }
        }
    } catch (error) {
        console.error('Error decoding token:', error);
    }
};
}