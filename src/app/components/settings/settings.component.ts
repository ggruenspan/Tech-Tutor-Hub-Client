import { Component, HostListener, Renderer2, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SettingsRoutesService } from '../../services/routes/settingsRoutes.service';
import { HandleDataService } from '../../services/handleData.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  isScreenLess = false;
  userName = '';
  role: string | null = null;
  isTutor = false;
  isAdmin = false;
  sidebarVisible = false;
  sidebarBtnClick = false;
  sidebarIcon: string = 'fa-chevron-right';
  profileImage: string | null = null;

  constructor(private toastr: ToastrService, private renderer: Renderer2, private settingsRoutes: SettingsRoutesService, private dataService: HandleDataService) {}

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
        }, 250); // Delay to close the menu with animation
    } else {
        this.sidebarVisible = true;
        this.sidebarIcon = this.sidebarVisible ? 'fa-chevron-down' : 'fa-chevron-right';
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
    }
  }

  // Handles user data from API
  handleUserData() {
    this.settingsRoutes.getPublicProfile().subscribe(() => {
      const userData = this.dataService.decodedToken();
      if (userData) {
        this.profileImage = localStorage.getItem('profileImage');
        this.userName = userData.userName;
        this.role = localStorage.getItem('role');

        // Update boolean flags
        this.isTutor = this.role?.includes('Tutor') ?? false;
        this.isAdmin = this.role?.includes('Admin') ?? false;
      }
    }, (error) => {
      this.toastr.error(error.error.message);
    });
  };
}
