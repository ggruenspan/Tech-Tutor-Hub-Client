import { Component, HostListener, Renderer2, OnInit } from '@angular/core';
import { APIRoutesService } from '../../services/apiRoutes.service';
import { HandleDataService } from '../../services/handleData.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  isScreenLess = false;
  userName = '';
  role = '';
  isTutor = false;
  isAdmin = false;
  sidebarVisible = false;
  sidebarBtnClick = false;
  sidebarIcon: string = 'fa-chevron-right';

  constructor(private renderer: Renderer2, private accountService: APIRoutesService, private dataService: HandleDataService) {}

  ngOnInit() {
    this.handleWindowResize(); // Initialize window resize handling
    this.handleUserData(); // Initialize user data handling
  }

  // Toggle the menu open or closed
  toggleSettingMenu() {
    if (this.sidebarVisible) {
        setTimeout(() => {
            this.sidebarVisible = false;
            this.sidebarIcon = this.sidebarVisible ? 'fa-chevron-down' : 'fa-chevron-right';
            this.toggleContentClasses();
        }, 250); // Delay to close the menu with animation
    } else {
        this.sidebarVisible = true;
        this.sidebarIcon = this.sidebarVisible ? 'fa-chevron-down' : 'fa-chevron-right';
        this.toggleContentClasses();
    }
  }

  // Toggle classes for the content based on menu state
  toggleContentClasses() {
    const settingsContent = document.querySelector('.settings-content');
    if (settingsContent) { 
      if (this.isTutor) { settingsContent.classList.toggle('tutor'); }
      else { settingsContent.classList.toggle('menu-open'); }
    }
  }

  // Listens to window resize event to handle changes in screen width
  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event) {
    this.handleWindowResize();
  }

  // Handles changes in window size
  private handleWindowResize() {
    if (window.innerWidth <= 991) {
      this.isScreenLess = true;
    } else { 
      this.isScreenLess = false;
      this.sidebarVisible = false;
      this.sidebarIcon = this.sidebarVisible ? 'fa-chevron-down' : 'fa-chevron-right';
      const element = document.getElementById('settings-menu');
      this.renderer.removeClass(element, 'show');
      const settingsContent = document.querySelector('.settings-content');
      if (settingsContent) { 
        if (this.isTutor) { settingsContent.classList.remove('tutor'); }
        else { settingsContent.classList.remove('menu-open'); }
      }
    }
  }

  // Handles user data from local storage
  handleUserData() {
    this.accountService.getUserData().subscribe(() => {
      const profileData = this.dataService.getUserProfile();
      if (profileData) {
        const storedUserName = profileData.userName
        const storedRole = profileData.role;
    
        this.userName = storedUserName !== null ? storedUserName : '';
        this.role = storedRole !== null ? storedRole : '';
        if (storedRole === 'Tutor') {  this.isTutor = true; } else { this.isTutor = false; }
        if (storedRole === 'Admin') {  this.isAdmin = true; } else { this.isAdmin = false; }
      }
    }, (error) => {
      console.error('Internal server error. Please try again');
    });
  };
}
