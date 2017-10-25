import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService, AuthService } from '../../services';
@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit, OnDestroy {
  queryParamSubs;
items = [];
docs = [];
dataSubscription;
categories = ['Food', 'Service', 'Travel', 'Miscellaneous'];
currentUid;
currentQueryParams = [];
currentcategories;
  constructor(
    private route: ActivatedRoute,
    private fService: FirestoreService,
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.currentUser$.subscribe(data => {
      if (data) {
        this.currentUid = data['uid'];
      }
    });
  }
  ngOnInit() {
    // this.currentUid = this.authService.currentUser.uid;
    this.route.queryParams.subscribe(data => {
      if (data) {
        this.currentcategories = [];
        Object.values(data).forEach(param => {
          this.currentcategories.push(param);
        });
        if (this.currentcategories.length === 0) {
          this.currentcategories.push('all');
        }
        this.getDocuments(this.currentcategories);
      }
    });
   }

   getDocuments(filterArray) {
     this.fService.getDocuments(this.currentcategories, true).subscribe(data => {
       if (data && data.length) {
         this.items = data;
         console.log(data);
       }
     });
   }

   showProduct(item) {
     this.router.navigate(['home/product', item.product_id]);
    }
    filter(category, event) {
      if (event.target.checked) {
        if (this.currentQueryParams.indexOf(category) === -1) {
          this.currentQueryParams.push(category);
        }
      } else {
        const index = this.currentQueryParams.indexOf(category);
        if (index > -1) {
          this.currentQueryParams.splice(index, 1);
        }
      }
      const queryParamsObject = {};
      this.currentQueryParams.forEach((param, index) => {
        queryParamsObject[`filter${index}`] = param;
      });
      this.router.navigate(['home/category'], {queryParams: queryParamsObject});
    }
    ngOnDestroy() {
      if (this.dataSubscription) {
        this.dataSubscription.unsubscribe();
      }
    }
  }
