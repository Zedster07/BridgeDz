import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  tabVal = 'edit';
  constructor() { }

  setTabVal( val: string) {
    this.tabVal = val;
  }
  showTab(val: string): boolean {
    if (val === this.tabVal) {
      return true;
    }
    return false;
  }
  changepic() {
    const elem = document.getElementById('changepichandler');
    elem.click();
  }

  ngOnInit() {
  }

}
