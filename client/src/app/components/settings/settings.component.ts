import { Component, HostListener, Renderer2, OnInit } from '@angular/core';
import { LocalStorageService } from '../../services/localStorage.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  isScreenLess = false;
  userName = '';
  profession = '';
  isTutor = false;
  sidebarVisible = false;
  sidebarBtnClick = false;
  sidebarIcon: string = 'fa-chevron-right';

  constructor(private renderer: Renderer2, private storageService: LocalStorageService) {}

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
  private handleUserData() {
    // Retrieve the from local storage
    const storedUserName = this.storageService.get('userName');
    const storedProfession = this.storageService.get('profession');
    const storedTutor = this.storageService.get('isTutor');


    this.userName = storedUserName !== null ? storedUserName : '';
    this.profession = storedProfession !== null ? storedProfession : 'User';
    if (storedTutor === 'true') {  this.isTutor = true; } else { this.isTutor = false; }
  };
}
