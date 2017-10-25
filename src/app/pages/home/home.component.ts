import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  userInfo = {};
  userInfoSubscription;
  constructor(private service: AuthService, private cdr: ChangeDetectorRef, private router: Router) {
    this.userInfoSubscription = this.service.getAuthState().subscribe(user => {
      if (user) {
        this.userInfo = user;
        console.log(this.userInfo);
      } else {
        this.userInfo = {};
      }
    });
   }

  ngOnInit() {
  }
  signOut() {
    this.service.logout().then(data => {
      console.log(data);
    });
  }

  navigate(category: string) {
    this.router.navigate(['home/add_product']);
  }

  ngOnDestroy () {
    this.userInfoSubscription.unsubscribe();
  }
}
