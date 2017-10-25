import { Location } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirestoreService, AuthService, CommonService } from '../../services';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {
  currentProductId;
  productData = {};
  dataSubscription;
  currentUid;
  isAuthor = false;
  isBidding = false;
  showMessage = false;
  isError = false;
  message;
  constructor(
    private fService: FirestoreService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private location: Location,
    private commonService: CommonService
  ) {
    this.currentProductId = this.route.snapshot.params.id;
    this.currentUid = this.auth.currentUser.uid;
  }

  ngOnInit() {
    this.dataSubscription = this.fService.getDocuments(this.currentProductId).subscribe(data => {
      if (data && data.length) {
        this.productData = data[0];
        this.isAuthor = this.currentUid === this.productData['author_uid'];
        console.log(data);
      }
    });
  }
  navigateBack() {
    this.location.back();
  }
  editOffer() {
    this.router.navigate(['home/edit_product', this.currentProductId]);
  }
  deleteOffer() {
    this.fService.deleteDocument(this.currentProductId);
  }
  updateDocument(value) {
    this.fService.updateDocument(this.currentProductId, value);
  }
  bidNow(value?) {
    this.showMessage = false;
    if (this.isBidding) {
      this.isBidding = false;
      if (this.productData['curr_val'] && value - this.productData['curr_val'] >= this.productData['increment']) {
        this.updateDocument(value);
      } else if (!this.productData['curr_val'] && value > this.productData['base_price']) {
        this.updateDocument(value);
      } else {
        this.handleMessage({'message': `Please check the value you have entered.
         Either the value is smaller than base price, or
         the incremented value is low. Please read the below message!`}, true);
      }
    } else {
      this.isBidding = true;
    }
  }
  handleMessage(err, errorFlag) {
    this.commonService.setLoader(false);
    this.isError = errorFlag;
    this.showMessage = true;
    this.message = err.message;
  }
  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }
}
