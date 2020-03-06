import { Component, OnInit } from '@angular/core';
import { GlobalsService } from '../services/globals.service';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss'],
})
export class MenuListComponent implements OnInit {

  constructor(private glb: GlobalsService) {

  }
  dissmisPopover() {
    this.glb.popover.dismiss();
  }
  ngOnInit() {}

}
