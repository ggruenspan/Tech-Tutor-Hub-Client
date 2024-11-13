import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserRoutesService } from '../../../services/routes/userRoutes.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  userName: string = '';
  userProfile: any;

  constructor(private route: ActivatedRoute, private userRoutes: UserRoutesService) {}

  ngOnInit(): void {
    // Get the username from the route
    this.userName = this.route.snapshot.paramMap.get('userName') || '';

    // Fetch the user profile
    this.userRoutes.getUserProfile(this.userName).subscribe((data) => {
      this.userProfile = data.user;
      console.log(data);
    });
  }
}
