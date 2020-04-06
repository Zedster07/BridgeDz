import { Component, OnInit } from '@angular/core';
import { GlobalsService } from 'src/app/services/globals.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-language',
  templateUrl: './language.page.html',
  styleUrls: ['./language.page.scss'],
})
export class LanguagePage implements OnInit {

  constructor(
    public glb: GlobalsService,
    private router: Router,
    private angularFireAuth: AngularFireAuth,
    private db: DbinteractionsService,
    private authser: LoginService,
    private lang :TranslateService
  ) { }

  dissmisPopover() {
    this.glb.popover.dismiss(this.glb.currentLang);
  }


  
  

  chooseLang(index) {

    if (index !==''){
      this.glb.currentLang = index;
      this.lang.use(this.glb.currentLang ); 
    }  
      this.glb.popover.dismiss(this.glb.currentLang);

  } 

  ngOnInit() {
  }

}
