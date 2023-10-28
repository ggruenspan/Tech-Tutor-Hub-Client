import { Component, HostListener, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Tech Tutor Hub';
  isOpened = false;
  isScrolled = false;
  scrollThreshold: number = 100;
  isScreenLess = false;

  constructor(private renderer: Renderer2) { }

  toggleMenu() {
    if (this.isOpened) {
      setTimeout(() => {
        this.isOpened = false;
      }, 350);
    } else {
      this.isOpened = true;
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.scrollY;

    if (scrollPosition > this.scrollThreshold) {
      this.isScrolled = true;
    } else {
      this.isScrolled = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event) {
    if (window.innerWidth >= 992 && this.isOpened) {
      this.isOpened = false;
      this.isScreenLess = false;
      const element = document.getElementById('navbarNav');
      this.renderer.removeClass(element, 'show');
    }

    if(window.innerWidth <= 750) {
      this.isScreenLess = true;
    } else {
      this.isScreenLess = false;
    }
    // this.isScreenLess = window.innerWidth <= 750;
  }
}
