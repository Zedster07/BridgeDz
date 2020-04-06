import { Component, OnInit } from '@angular/core';
import {TranslateService, TranslatePipe, TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    public translate: TranslateService,
  ) { }

  ngOnInit() {
  }

}
