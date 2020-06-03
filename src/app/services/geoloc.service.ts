import { Injectable, NgZone } from '@angular/core';

import {latLng, MapOptions, tileLayer, Map, Marker, icon} from 'leaflet';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {NominatimResponse} from '../../../node_modules/angular-osm';
import {map} from 'rxjs/operators';

declare var ol: any;
declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class GeolocService {

  service = new google.maps.places.AutocompleteService();

  BASE_NOMINATIM_URL: string = 'nominatim.openstreetmap.org';
  DEFAULT_VIEW_BOX: string = 'countrycodes=';

  //DEFAULT_VIEW_BOX: string = 'viewbox=37.0000%2C4.9000%2C35.000%2C3.4000';


  constructor(
    private http: HttpClient,
    private zone: NgZone,
  ) { }

  addressLookup(req: any, country: string, limit: number): Observable<NominatimResponse[]> {
    //console.log('do we pass by here');
    let url = `https://${this.BASE_NOMINATIM_URL}/search?format=json&q=${req}&${this.DEFAULT_VIEW_BOX}&${country}&limit=${limit}&bounded=1&admin_level=2`;
    return this.http
      .get(url).pipe(
        map((data: any[]) => data.map((item: any) =>(
          item
          ))
        )
      )
  }

  geoCode(address:any, latitude, longitude) {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, (results, status) => {
    latitude = results[0].geometry.location.lat();
    longitude = results[0].geometry.location.lng();
   });
  }

  getPrediction(autocomplete, autocompleteItems){
     this.service.getPlacePredictions({
    input: autocomplete.query,
    componentRestrictions: {
      country: 'dz'
    }
   }, (predictions, status) => {
     autocompleteItems = [];

     this.zone.run(() => {
      if (predictions != null) {
        predictions.forEach((prediction) => {
          autocompleteItems.push(prediction.description);
        });
      }
      });
    });
  }

}
