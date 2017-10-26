import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService, AuthService, CommonService } from '../../services';
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
sortOptions = [
  {
    name: 'Recent',
    key: 'createdAt'
  },
  {
    name: 'Popularity',
    key: 'bid_count'
  },
  {
    name: 'Price-LowToHigh',
    key: 'base_price'
  },
  {
    name: 'Price-HighToLow',
    key: 'base_price'
  }
];
currentUid;
currentQueryParams = [];
currentcategories;
currentRoute;
categoryPage = true;
routeSegments = [];
currentFilter;
currentSortOption = this.sortOptions[0].key;
isPriceLowToHigh = false;
isAdmin = false;
isPending = true;
  constructor(
    private route: ActivatedRoute,
    private fService: FirestoreService,
    private authService: AuthService,
    private router: Router,
    private commonService: CommonService
  ) {
  }
  ngOnInit() {
    this.authService.currentUser$.subscribe(data => {
      if (data) {
        this.currentUid = data['uid'];
        console.log(this.currentUid, data['uid']);
      }
    });
    this.currentRoute = this.router.url;
    console.log(this.currentRoute.split('/').slice(1));
    this.routeSegments = this.currentRoute.split('?')[0].split('/').slice(1);
    if (this.currentRoute.indexOf('category') > -1) {
      this.categoryPage = true;
      this.isAdmin = false;
    } else if (this.currentRoute.indexOf('admin') > -1) {
      this.isAdmin = true;
      this.categoryPage = true;
    } else {
      this.isAdmin = false;
      this.categoryPage = false;
    }
    this.route.queryParams.subscribe(data => {
      if (data) {
        this.currentFilter = data.filter;
        if (this.dataSubscription) {
          this.dataSubscription.unsubscribe();
        }
        this.getDocuments(this.currentFilter, this.currentSortOption, this.isAdmin ? (this.isPending ? false : true) : true);
      }
    });
   }

   getDocuments(filter, sort, type) {
     this.dataSubscription = this.fService.getDocuments(filter, true, this.categoryPage, sort, type).subscribe(data => {
       if (data && data.length) {
         if (this.isPriceLowToHigh) {
           this.items = data.reverse();
         } else {
           this.items = data;
         }
         console.log(this.items);
       } else {
         this.items = [];
       }
     });
   }

   showProduct(item) {
     this.router.navigate(['home/product', item.product_id]);
    }

    navigate(filter?) {
      const parentRoute = this.categoryPage ? (this.isAdmin ? 'admin' : 'category') : 'my_offers';
      if (filter) {
        this.router.navigate([`home/${parentRoute}`], {queryParams : {filter: filter}});
      } else {
        this.router.navigate([`home/${parentRoute}`]);
      }
    }
    navigateToUrl(route) {
      this.router.navigate([route]);
    }
    bid(product_id) {
      this.router.navigate([`home/product/${product_id}`]);
    }
    sort(value) {
      this.sortOptions.forEach(sort => {
        if (sort.name === value) {
          this.isPriceLowToHigh = sort.name === 'Price-LowToHigh' ? true : false;
          this.currentSortOption = sort.key;
          return;
        }
      });
      this.getDocuments(this.currentFilter, this.currentSortOption, this.isAdmin ? (this.isPending ? false : true) : true);
      console.log(value);
    }
    show(type: string) {
      this.isPending = type === 'pending' ? true : false;
      this.getDocuments(this.currentFilter, this.currentSortOption, this.isAdmin ? (this.isPending ? false : true) : true);
    }
    ngOnDestroy() {
      if (this.dataSubscription) {
        this.dataSubscription.unsubscribe();
      }
    }
  }
