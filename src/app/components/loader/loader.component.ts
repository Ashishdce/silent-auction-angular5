import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  showLoader = false;
  constructor(private commonService: CommonService) { }

  ngOnInit() {
    this.commonService.$loader.subscribe(data => {
      this.showLoader = data;
    });
  }

}
