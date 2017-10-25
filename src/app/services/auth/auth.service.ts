import { BehaviorSubject } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { CommonService } from '../common/common.service';
@Injectable()
export class AuthService implements OnInit, OnDestroy {
  stateChangeSubs;
  // public $userInfo = new Subject<Object>();
  private $authState: Observable<firebase.User>;
  currentUser: firebase.User = null;
  currentUser$ = new BehaviorSubject<any>({});
  constructor(public afAuth: AngularFireAuth, private router: Router, private commonService: CommonService) {
    this.$authState = this.afAuth.authState;
    this.$authState.subscribe(user => {
      this.commonService.setLoader(false);
      if (user) {
        this.currentUser = user;
        this.currentUser$.next(this.currentUser);
        // this.router.navigate(['home']);
      } else {
        this.currentUser = null;
        this.currentUser$.next({});
        this.router.navigate(['welcome/login']);
      }
    });
  }
  getAuthState() {
    return this.$authState;
  }
  ngOnInit () { }

  login(type: boolean, email?, password?) {
    if (type && email && password) {
      return this.afAuth.auth.signInWithEmailAndPassword(email, password);
    } else {
      return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }
  }
  signup(email, password) {
      return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }
  logout() {
    return this.afAuth.auth.signOut();
  }
  ngOnDestroy () {
    this.stateChangeSubs.unsubscribe();
  }
}
