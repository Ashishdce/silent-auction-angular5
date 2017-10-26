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
  adminUsers;
  showAdminButton = false;
  constructor(private service: AuthService, private cdr: ChangeDetectorRef, private router: Router) {
    this.adminUsers  = this.service.getAdmins();
    this.userInfoSubscription = this.service.currentUser$.subscribe(user => {
      if (user) {
        this.userInfo = user;
        console.log(this.userInfo);
        if (this.adminUsers.indexOf(this.userInfo['uid']) > -1) {
          this.showAdminButton = true;
        } else {
          this.showAdminButton = false;
        }
      } else {
        this.userInfo = {};
        this.showAdminButton = false;
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
