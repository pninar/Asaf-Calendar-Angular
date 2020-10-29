import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Holiday } from './holiday.interface';

// get your own key from https://holidayapi.com/
const HOLIDAY_API_KEY = 'fc620f1b-f052-4d1c-b537-47e5d44a892a';

// change this to your own country
const COUNTRY_CODE = 'IL';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {

  constructor(private http: HttpClient) { }

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

  getHolidays() {
    return this.http
      .get<{ holidays: Holiday[] }>('https://holidayapi.com/v1/holidays',
        {
          params: {
            country: COUNTRY_CODE,
            year: String(new Date().getFullYear() - 1),
            key: HOLIDAY_API_KEY,
          },
        })
  }
}

