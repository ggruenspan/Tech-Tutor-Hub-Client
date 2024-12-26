import { Component, HostListener, Renderer2, OnInit } from '@angular/core';
import { AuthRoutesService } from './services/routes/authRoutes.service';
import { HandleDataService } from './services/handleData.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Tech Tutor Hub';
  isSmaller = false;
  isOpened = false;
  isScrolled = false;
  scrollThreshold: number = 100;
  isScreenLess = false;
  session: string | null = null;
  userName = '';
  menuVisible = false;
  menuBtnClick = false;
  menuIcon: string = 'fa-caret-right';
  profileImage: string | null = null;

  constructor(private renderer: Renderer2, private authService: AuthRoutesService, private dataService: HandleDataService) {

    // Event listener to close the user menu when clicking outside
    this.renderer.listen('window', 'click', (e: Event) => {
      if (!this.menuBtnClick) {
        this.menuVisible = false;
        this.menuIcon = this.menuVisible ? 'fa-caret-down' : 'fa-caret-right';
      }
      this.menuBtnClick = false;
    });
  }

  ngOnInit() {
    this.handleWindowResize(); // Initialize window resize handling
    this.handleUserData(); // Initialize user data handling
  }

  // Toggle the menu open or closed
  toggleMenu() {
    if (this.isOpened) {
      setTimeout(() => {
        this.isOpened = false;
      }, 500); // Delay to close the menu with animation
    } else {
      this.isOpened = true;
    }

    if (this.menuVisible && this.isOpened) {
      this.toggleUserOpt();
    }
  }

  // Handle user sign out
  handleSignOut() {
    this.dataService.clearData();
  }

  // Toggle visibility of the user menu
  toggleUserOpt() {
    this.menuVisible = !this.menuVisible;
    this.menuIcon = this.menuVisible ? 'fa-caret-down' : 'fa-caret-right';

    if (this.menuVisible && this.isOpened) {
      this.isOpened = false;
      const element = document.getElementById('navbarNav');
      this.renderer.removeClass(element, 'show'); // Remove 'show' class to hide the menu
    }
  }

  // Function to prevent closing the user menu when clicking on it
  preventCloseOnClick() {
    this.menuBtnClick = true;
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
    if (this.menuVisible) {
      this.toggleUserOpt();
    }
  }

  // Handles changes in window size, and close the menu if it's open on larger screens
  private handleWindowResize() {
    if (window.innerWidth >= 992 && this.isOpened) {
      this.isOpened = false;
      const element = document.getElementById('navbarNav');
      this.renderer.removeClass(element, 'show'); // Remove 'show' class to hide the menu
    }

    if (window.innerWidth <= 750) {
      this.isScreenLess = true;
    } else {
      this.isScreenLess = false;
      this.isOpened = false;
      const element = document.getElementById('navbarNav');
      this.renderer.removeClass(element, 'show');
    }
  }

  // Handles user data from JWT token stored in local storage
  private handleUserData() {
    this.authService.isAuthenticated();
    const profileData = this.dataService.decodedToken();
    if (profileData) {
      this.userName = profileData.userName;
      this.session = localStorage.getItem('session');
      this.profileImage = localStorage.getItem('profileImage');
    }
  }
}