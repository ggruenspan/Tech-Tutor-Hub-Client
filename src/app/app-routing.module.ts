import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';

import { ProtectedRouteGuardService as ProtectedRouteGuard } from './guards/protected-route.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: '', loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule), canActivate: [ProtectedRouteGuard] },
  { path: '', loadChildren: () => import('./modules/settings/settings.module').then(m => m.SettingsModule), canActivate: [ProtectedRouteGuard] },
  { path: '', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
  { path: '', loadChildren: () => import('./modules/core/core.module').then(m => m.CoreModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
