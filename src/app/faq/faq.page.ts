import { Component, OnInit } from '@angular/core';
import { GlobalsService } from '../services/globals.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit {

  constructor(private glb: GlobalsService) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.glb.isMainPage = false;
  }

}
