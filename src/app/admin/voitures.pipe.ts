import { Pipe, PipeTransform } from '@angular/core';

 @Pipe({
   name: 'voitures'
 })
 export class VoituresPipe implements PipeTransform {

   transform(value: any, ...args: any[]): any {
     return null;
   }

 }