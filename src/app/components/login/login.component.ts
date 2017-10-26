import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService, CommonService} from '../../services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isLogin = true;
  showMessage = false;
  message;
  constructor(private router: Router, private auth: AuthService, private commonService: CommonService) { }

  ngOnInit() {
    const currRoute = this.router.url;
    if (currRoute.indexOf('login') > -1) {
      this.isLogin = true;
    } else {
      this.isLogin = false;
    }
  }
  navigate(routeName: string) {
    this.router.navigate(['welcome', routeName]);
  }
  loginWithGoogle () {
    this.commonService.setLoader(true);
    this.auth.login(false).then(data => {
      console.log(data);
      this.router.navigate(['home']);
    this.commonService.setLoader(false);
    
    }).catch(err => {
      this.router.navigate(['welcome/login']);
      this.showError(err);
    });
  }
  loginWithCredentials(email?, password?) {
    this.commonService.setLoader(true);
    if (email && password) {
      this.auth.login(true, email, password).then(data => {
        console.log(data);
        this.router.navigate(['home']);
      }).catch(err => {
        this.router.navigate(['welcome/login']);
        this.showError(err);
      });
    } else {
      this.showError({message: 'Please provide both email and password'});
    }
  }
  signUpWithCredentials(email, password) {
    this.commonService.setLoader(true);
    if (email && password) {
      this.auth.signup(email, password).then(data => {
        this.router.navigate(['home']);
        console.log(data);
      }).catch(err => {
        this.router.navigate(['welcome/login']);
        this.showError(err);
      });
    } else {
      this.showError({message: 'Please provide both email and password'});
    }
  }
  showError(errorObject) {
    this.commonService.setLoader(false);
    if (errorObject) {
      console.log('Error: ', errorObject);
      this.showMessage = true;
      this.message = errorObject.message;
    }
  }
}
