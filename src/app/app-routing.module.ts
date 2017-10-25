import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';


const routes: Routes = [
  {
    path: 'welcome',
    loadChildren: 'app/pages/landing/landing.module#LandingModule'
  },
  {
    path: 'home',
    loadChildren: 'app/pages/home/home.module#HomeModule'
  },
  {
    path: 'not-found',
    loadChildren: 'app/pages/not-found/not-found.module#NotFoundModule'
  },
  {
    path: '',
    redirectTo: '/welcome/overview',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/welcome/overview',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
