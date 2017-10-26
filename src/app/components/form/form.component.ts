import { Location } from '@angular/common';
import { AuthService, FirestoreService, CommonService } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, AfterViewInit, OnDestroy {
  message;
  showMessage = false;
  editMode = false;
  currentProductId;
  dataSubscription;
  productData = {};
  user;
  constructor(
    private router: Router,
    private authService: AuthService,
    private fService: FirestoreService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private location: Location) {
    }

    ngOnInit() {
      this.authService.currentUser$.subscribe(data => {
        if (data) {
          this.user = data;
        }
      });
    if (this.router.url.indexOf('edit_product') > -1) {
      this.editMode = true;
      this.currentProductId = this.route.snapshot.params.id;
      this.auth.currentUser$.subscribe(data => {
        if (data) {
          this.user = data;
        }
      });
      this.dataSubscription = this.fService.getDocuments(this.currentProductId).subscribe(data => {
        if (data && data.length) {
          this.productData = data[0];
          const inputs = document.querySelectorAll('input');
          const descField = document.querySelector('textarea');
          const category = document.querySelector('select');
          inputs[0].value = this.productData['name'];
          inputs[1].value = this.productData['base_price'];
          inputs[2].value = this.productData['increment'];
          descField.value = this.productData['desc'];
          category.value = this.productData['category'].charAt(0).toUpperCase() + this.productData['category'].slice(1);
        }
      });
    } else {
      this.editMode = false;
    }
  }
  addProduct(name, category, base_val, increment, desc) {
    if (name && category && base_val && increment && desc) {
      let postObj;
      if (this.editMode) {
        postObj = {
          'name': name,
          'desc': desc,
          'base_price': Number(base_val),
          'increment': Number(increment),
          'category': category.toLowerCase(),
        };
      } else {
        postObj = {
          'name': name,
          'desc': desc,
          'base_price': Number(base_val),
          'increment': Number(increment),
          'photo': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_LdVq9LAFZLNXpiyqXWnLoxQ_SKyFd6qooWlVvaFzOAaJPsQTIA',
          'category': category.toLowerCase(),
          'curr_val': null,
          'author_uid': this.user.uid,
          'product_id': Math.random().toString(36).slice(2),
          'bid_count': 0,
          'author_email': this.user.email,
          'author_name': this.user.displayName,
          'status': 'pending'
        };
      }
      console.log(category.toLowerCase(), postObj);
      this.commonService.setLoader(true);
      if (this.editMode) {
        this.fService.updateDocument(this.currentProductId, 'edit', postObj);
      } else {
        this.fService.addDocument(postObj).then(res => {
          console.log(res);
          this.commonService.setLoader(false);
          this.router.navigate(['home']);
        }).catch(err => {
          this.showError(err);
        });
      }
    } else {
      this.showError({'message': 'All the fields are required. Please try again.'});
    }
  }
  formCancel() {
    if (this.editMode) {
      this.location.back();
    } else {
      this.router.navigate(['home']);
    }
  }
  showError(err) {
    this.commonService.setLoader(false);
    if (err) {
      console.log('Error: ', err);
      this.message = err.message;
      this.showMessage = true;
    }
  }

  ngAfterViewInit() {
    if (this.editMode) {
      // console.log(document.querySelectorAll('input'));
      // const inputs = document.querySelectorAll('input');
      // const descField = document.querySelector('textarea');
      // const category = document.querySelector('select');
      // inputs[0].value = this.productData['name'];
      // inputs[1].value = this.productData['base_price'];
      // inputs[2].value = this.productData['increment'];
      // descField.value = this.productData['desc'];
      // category.value = this.productData['category'].charAt(0).toUpperCase() + this.productData['category'].slice(1);
    }
  }
  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}
