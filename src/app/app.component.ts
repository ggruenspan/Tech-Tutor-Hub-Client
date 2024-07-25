import { Component, HostListener, Renderer2, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from './services/localStorage.service';
import { APIRoutesService } from './services/apiRoutes.service';
import { HandleDataService } from './services/handleData.service';

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
  session = '';
  userName = '';
  menuVisible = false;
  menuBtnClick = false;
  menuIcon: string = 'fa-caret-right';


  constructor(private toastr: ToastrService, private renderer: Renderer2, private accountService: APIRoutesService, 
              private storageService: LocalStorageService, private dataService: HandleDataService) {

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
    this.accountService.signOut().subscribe((response) => {
        this.toastr.success(response.message);
        this.dataService.removeData();
        setTimeout(() => {
          window.location.replace('/');
        }, 1000);
      }, (error) => {
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
    this.dataService.setData();
    const storedUserName = this.storageService.get('userName');
    const storedSession= this.storageService.get('session');

    this.userName = storedUserName !== null ? storedUserName : '';
    this.session = storedSession !== null ? storedSession : '';
  };
}