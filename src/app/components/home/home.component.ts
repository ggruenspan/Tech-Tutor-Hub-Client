import { Component, HostListener, OnInit } from '@angular/core';
// import { TutorRoutesService } from '../../services/routes/tutorRoutes.service';
// import { HandleDataService } from '../../services/handleData.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit  {
  isScreenLess = false;
  changeSearchBar = false;

  // constructor(private tutorService: TutorRoutesService) {}

  ngOnInit() {
    this.handleWindowResize(); // Initialize window resize handling
    // this.handleTutorData(); // Initialize tutor data handling
  }

  // Listens to window resize event to handle changes in screen width
  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event) {
    this.handleWindowResize();
  }

  // Handles changes in window size
  private handleWindowResize() {
    if (window.innerWidth >= 992) {
      this.isScreenLess = true;
    } else { 
      this.isScreenLess = false;
    }

    if (window.innerWidth >= 481) {
      this.changeSearchBar = true;
    } else { 
      this.changeSearchBar = false;
    }
  }


  // Handles user data from API
  // handleTutorData() {};
}
