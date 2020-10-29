import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {

  constructor() { }

  getHebrewName(englishName: string): string {
    //Using Map
    let map = new Map<string, string>();

    map.set("Erev Purim", "ערב פורים");
    map.set("Purim (Tel Aviv)", "פורים");
    map.set("Erev Pesach", "ערב פסח");

    if (map.has(englishName))
      return map.get(englishName);
    else
      return englishName;
  }
}

