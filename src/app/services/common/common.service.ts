import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';

@Injectable()
export class CommonService {
  $loader = new Subject<boolean>();
  constructor() { }

  setLoader(val: boolean) {
    this.$loader.next(val);
  }
}
