import { Component, HostListener, Renderer2, OnInit } from '@angular/core';

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

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    this.handleWindowResize(); // Initialize window resize handling
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
}