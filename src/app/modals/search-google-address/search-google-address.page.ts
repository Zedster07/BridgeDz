import { Component, OnInit, NgZone } from '@angular/core';
 import { ModalController } from '@ionic/angular';
 //import {googlemaps} from 'googlemaps';
 import { GlobalsService } from 'src/app/services/globals.service';
 

 @Component({
   selector: 'app-search-google-address',
   templateUrl: './search-google-address.page.html',
   styleUrls: ['./search-google-address.page.scss'],
 })



 export class SearchGoogleAddressPage implements OnInit {
   autocompleteItems;
   autocomplete;

   latitude: number = 0;
   longitude: number = 0;
   geo: any
 

   //service = new google.maps.places.AutocompleteService();

   constructor (
     public viewCtrl: ModalController, 
     private zone: NgZone,
     private glb: GlobalsService) {
     this.autocompleteItems = [];
     this.autocomplete = {
       query: ''
     };
   }

   dismiss() {
     this.viewCtrl.dismiss();
   }

   /*chooseItem(item: any) {
     this.viewCtrl.dismiss(item);
     this.glb.searchQuery.address = item;
     this.geo = item;
     this.geoCode(this.geo);//convert Address to lat and long
   }

   updateSearch() {

     if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
     }

     let me = this;
     this.service.getPlacePredictions({
     input: this.autocomplete.query,
     componentRestrictions: {
       country: 'dz'
     }
    }, (predictions, status) => {
      me.autocompleteItems = [];

      me.zone.run(() => {
       if (predictions != null) {
         predictions.forEach((prediction) => {
           me.autocompleteItems.push(prediction.description);
         });
       }
       });
     });
   }

   // convert Address string to lat and long
   geoCode(address:any) {
     let geocoder = new google.maps.Geocoder();
     geocoder.geocode({ 'address': address }, (results, status) => {
     this.latitude = results[0].geometry.location.lat();
     this.longitude = results[0].geometry.location.lng();
     alert("lat: " + this.latitude + ", long: " + this.longitude);
    });
  }*/
   ngOnInit() {}
 }