import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { GlobalsService } from 'src/app/services/globals.service';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';

@Component({
  selector: 'app-client-menu-list',
  templateUrl: './client-menu-list.component.html',
  styleUrls: ['./client-menu-list.component.scss'],
})
export class ClientMenuListComponent implements OnInit {

  constructor(
    private logins: LoginService,
    public glb: GlobalsService, 
    private db: DbinteractionsService,) { }
  logout() {
    this.dissmisPopover();
    this.logins.logOut();
    const res = this.db.updateHistoricalLogIn();
  }
  dissmisPopover() {
    this.glb.popover.dismiss();
  }
  ngOnInit() {}

}
