import { Component, HostListener, Renderer2, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { APIRoutesService } from './services/apiRoutes.service';
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
  session: any = null;
  userName = '';
  menuVisible = false;
  menuBtnClick = false;
  menuIcon: string = 'fa-caret-right';


  constructor(private toastr: ToastrService, private renderer: Renderer2, private accountService: APIRoutesService, 
              private LocalStorageService: LocalStorageService) {

                // Event listener to close the user menu when clicking outside
                this.renderer.listen('window', 'click', (e: Event) => {
                  if (!this.menuBtnClick) {
                    this.menuVisible = false;
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
      }, 350); // Delay to close the menu with animation
    } else {
      this.isOpened = true;
    }

    if (this.menuVisible && this.isOpened) {
      this.toggleUserOpt();
    }
  }

  // Handle user sign out
  handleSignOut() {
    this.accountService.signOut().subscribe((response) => {
        // console.log('User signed out successfully', response);
        this.toastr.success(response.message);
        this.toggleMenu();
        this.LocalStorageService.remove('jwtToken');
        setTimeout(() => {
          window.location.replace('/');
        }, 1000);
      }, (error) => {
        // console.error('SignOut error', error);
        this.toastr.error(error.error.message);
      }
    );
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
    try {
        const token = this.LocalStorageService.get('jwtToken');
        const helper = new JwtHelperService();
        if (token) {
          const decodedToken = helper.decodeToken(token)
            if (decodedToken.exp * 1000 > (Date.now()+ (60 * 60 * 1000))) {
              this.LocalStorageService.set('userName', decodedToken.userName);
              this.session = true;
              this.userName = decodedToken.userName;
            } else {
              this.LocalStorageService.remove('jwtToken');
              this.LocalStorageService.remove('userName');
              this.session = false;
              this.userName = '';
            }
        }
    } catch (error) {
        console.error('Error decoding token:', error);
    }
  };
}