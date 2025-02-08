import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserProfileRoutesService } from '../../../services/routes/user/userProfileRoutes.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userName: string = '';
  userProfile: any;

  constructor(private route: ActivatedRoute, private userRoutes: UserProfileRoutesService) {}

  ngOnInit(): void {
    // Extract the 'username' parameter from the URL
    this.route.paramMap.subscribe(params => {
      this.userName = params.get('userName') || '';
      this.loadUserProfile(this.userName);
    });
  }

  loadUserProfile(userName: string) {
    // Fetch the user profile
    this.userRoutes.getUserProfile(userName).subscribe((data) => {
      this.userProfile = data.user;
      console.log(data);
    });
  }
}