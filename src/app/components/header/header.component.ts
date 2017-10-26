import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../services';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input('flag') flag;
  @Input('data') data?;
  adminUsers;
  showAdminButton = false;
  constructor(private router: Router, private auth: AuthService) {}
  ngOnInit() {
  }

  navigate(routeName: string) {
    this.router.navigate(['welcome', routeName]);
  }
  signOut() {
    this.auth.logout().catch(err => {
      console.log('Error: ', err.message);
    });
  }
}
