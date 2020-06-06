import { Component, OnInit } from '@angular/core';
import { GlobalsService } from '../services/globals.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss'],
})
export class MenuListComponent implements OnInit {

  constructor(private glb: GlobalsService, translate: TranslateService,) {

  }
  dissmisPopover() {
    this.glb.popover.dismiss();
  }
  ngOnInit() {}

}
