import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LandingComponent } from './landing.component';

import { ComponentsModule } from '../../components/components.module';

import { OverviewComponent } from '../../components/overview/overview.component';
import { LoginComponent } from '../../components/login/login.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule.forChild([
      {
        path: '',
        component: LandingComponent,
        children: [
          {
            path: 'login',
            component: LoginComponent,
          },
          {
            path: 'overview',
            component: OverviewComponent,
          },
          {
            path: 'signup',
            component: LoginComponent,
          },
          {
            path: '',
            redirectTo: 'overview',
            pathMatch: 'full',
          },
          {
            path: '**',
            redirectTo: 'overview',
            pathMatch: 'full',
          }
        ]
      }
    ])
  ],
  declarations: [LandingComponent]
})
export class LandingModule { }
