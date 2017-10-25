import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  navigate(routeName: string) {
    this.router.navigate(['welcome', routeName]);
  }
}
