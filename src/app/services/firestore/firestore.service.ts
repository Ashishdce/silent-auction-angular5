import { Router } from '@angular/router';
import { getCollection } from '@angular/cli/utilities/schematics';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { CommonService } from '../common/common.service';
import { AuthService } from '../auth/auth.service';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from 'angularfire2/firestore';


@Injectable()
export class FirestoreService {
  private itemsCollection: AngularFirestoreCollection<any>;
  private itemDocument: AngularFirestoreDocument<any>;
  items: Observable<any[]>;
  document: Observable<any>
  updateSubscription;
  private base = 'silent-auction';
  constructor(
    private afs: AngularFirestore,
    private commonService: CommonService,
    private auth: AuthService,
    private router: Router
  ) {
    this.itemsCollection = this.afs.collection(this.base);
    this.items = this.itemsCollection.valueChanges();
  }

  addDocument(docData: Object) {
    return this.itemsCollection.add({
      ...docData,
      createdAt: this.timestamp
    });
  }
  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }
  getDocuments(criterion?, isFilter?) {
    console.log(this.itemsCollection);
    if (isFilter) {
      if (criterion.indexOf('all') > -1) {
        return this.afs.collection(this.base).valueChanges();
      }
      let obs = this.afs.collection(this.base, ref => ref.where('category', '==', criterion[0])).valueChanges();
      criterion.slice(1).forEach(val => {
        // let obs = this.afs.collection(this.base, ref => ref.where('category', '==', val)).valueChanges();
        obs = obs.concat(this.afs.collection(this.base, ref => ref.where('category', '==', val)).valueChanges());
      });
      return obs;
    } else {
      return this.afs.collection(this.base, ref => ref.where('product_id', '==', +criterion)).valueChanges();
    }
  }
  updateDocument(product_id, val, isUpdate ? ) {
    this.commonService.setLoader(true);
    this.updateSubscription = this.afs.collection(this.base, ref => ref.where('product_id', '==', +product_id)).stateChanges()
      .subscribe(data => {
        if (data) {
          this.updateSubscription.unsubscribe();
          const docId = data[0]['payload']['doc']['id'];
          if (isUpdate) {
            this.afs.collection(this.base).doc(docId).update(val)
            .then(res => {
              console.log('Success updated', res);
              this.commonService.setLoader(false);
              this.router.navigate(['home/product', product_id]);
            }).catch(err => {
              this.commonService.setLoader(false);
              console.log('Error : ', err.message);
            });
          } else {
            this.afs.collection(this.base).doc(docId).update({
              'curr_val': val
            }).then(res => {
              return this.afs.collection(`${this.base}/${docId}/bid-collection`).add({
                'bidder_uid': this.auth.currentUser.uid,
                'bid_time': this.timestamp,
                'bid_value': val,
              });
            }).then(res => {
              console.log('Success updated and written bidder info', res);
              this.commonService.setLoader(false);
            }).catch(err => {
              this.commonService.setLoader(false);
              console.log('Error : ', err.message);
            });
          }
        }
      });
  }


  deleteDocument(product_id) {
    this.commonService.setLoader(true);
    this.updateSubscription = this.afs.collection(this.base, ref => ref.where('product_id', '==', +product_id)).stateChanges()
    .subscribe(data => {
      if (data) {
        this.updateSubscription.unsubscribe();
        const docId = data[0]['payload']['doc']['id'];
      this.afs.collection(this.base).doc(docId).delete()
      .then(res => {
          console.log('Success deleted document', res);
          this.commonService.setLoader(false);
          this.router.navigate(['home/category']);
        }).catch(err => {
          this.commonService.setLoader(false);
          console.log('Error : ', err.message);
        });
      }
    });
  }
}
