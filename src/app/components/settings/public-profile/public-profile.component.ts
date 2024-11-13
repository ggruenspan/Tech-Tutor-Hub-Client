import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SettingsRoutesService } from '../../../services/routes/settingsRoutes.service';

@Component({
  selector: 'app-account',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.scss']
})
export class PublicProfileComponent {
  userName: string = '';
  userProfile: any;

  constructor(private route: ActivatedRoute, private settingsRoutes: SettingsRoutesService) {}

  ngOnInit(): void {
    // Get the username from the route
    this.userName = this.route.snapshot.paramMap.get('userName') || '';

    // Fetch the user profile
    this.settingsRoutes.getPublicProfile().subscribe((data) => {
      this.userProfile = data.user;
      console.log(data.user);
    });
  }
}