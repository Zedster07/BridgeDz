import { Component, ViewChild } from '@angular/core';
import { PopoverController, PickerController } from '@ionic/angular';
import { MenuListComponent } from '../menu-list/menu-list.component';
import { AnimationBuilder, PickerOptions } from '@ionic/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  @ViewChild('finDate' , {static: true} ) finDate;
  @ViewChild('debutDate' , {static: true} ) debutDate;
  debutDateStr = 'Debut';
  finDateStr = 'Fin';
  constructor(public popoverController: PopoverController , private pickerCtrl: PickerController ) {}
  customPickerOptions: PickerOptions = {
    columns: [
      { name: 'Moi' , options: []},
      { name: 'Jour' , options: []},
      { name: 'Année' , options: []},
      { name: 'Heur' , options: []},
      { name: 'Minutes' , options: []},
    ]
  } ;
  async showmypicker() {
    const opts = {
      buttons : [

      ],
      columns: [
        {
          name: 'Jour',
          options: [
            {text: '01'  , value: '01'},
            {text: '02'  , value: '02'},
            {text: '03'  , value: '03'}
          ]
        },
        {
          name: 'mois',
          options: [
            {text: 'Jan'  , value: 'jan'},
            {text: 'Fev'  , value: 'fev'},
            {text: 'Mar'  , value: 'mar'},
          ]
        },
        {
          name: 'année',
          options: [
            {text: '2017'  , value: '2017'},
            {text: '2018'  , value: '2018'},
            {text: '2019'  , value: '2019'}
          ]
        }
      ],
      cssClass: 'myPicker'
    };
    const picker = await this.pickerCtrl.create(opts);
    picker.present();
    picker.onDidDismiss().then(data => {
      console.log(picker.getColumn('jour'));
      console.log(picker.getColumn('mois'));
      console.log(picker.getColumn('année'));
    });
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: MenuListComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

}
