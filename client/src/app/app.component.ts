import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Tech Tutor Hub';
  isScrolled = false;
  
  // @HostListener('window:scroll', [])
  // onWindowScroll() {
  //   // This function will be called when the user scrolls
  //   if (window.pageYOffset >= 600) {
  //     this.isScrolled = true;
  //   } else {
  //     this.isScrolled = false;
  //   }
  // }
}
