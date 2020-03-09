import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { GlobalsService } from 'src/app/services/globals.service';

@Component({
  selector: 'app-client-menu-list',
  templateUrl: './client-menu-list.component.html',
  styleUrls: ['./client-menu-list.component.scss'],
})
export class ClientMenuListComponent implements OnInit {

  constructor(
    private logins: LoginService,
    public glb: GlobalsService ) { }
  logout() {
    this.dissmisPopover();
    this.logins.logOut();
  }
  dissmisPopover() {
    this.glb.popover.dismiss();
  }
  ngOnInit() {}

}
