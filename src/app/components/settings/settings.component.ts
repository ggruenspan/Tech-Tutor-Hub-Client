import { Component, HostListener, Renderer2, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserRoutesService } from '../../services/userRoutes.service';
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
  profileImage: string | null = null;

  constructor(private toastr: ToastrService, private renderer: Renderer2, private userService: UserRoutesService, private dataService: HandleDataService) {}

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
    this.userService.getUserData().subscribe(() => {
      const profileData = this.dataService.getUserProfile();
      if (profileData) {
        this.profileImage = localStorage.getItem('profileImage');
        this.userName = profileData.userName;

        // Determine the role based on the presence of 'Tutor' and 'Admin'
        this.role = profileData.role.includes('Admin') && profileData.role.includes('Tutor')
            ? 'Admin/Tutor'
            : profileData.role.includes('Admin')
            ? 'Admin'
            : profileData.role.includes('Tutor')
            ? 'Tutor'
            : 'User';

        localStorage.setItem('role', this.role);
        
        // Update boolean flags
        this.isTutor = this.role.includes('Tutor');
        this.isAdmin = this.role.includes('Admin');
      }
    }, (error) => {
      this.toastr.error(error.error.message);
    });
  };
}
