import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'calendar';

  constructor(public router: Router) {
  }


  goCalendarDemo() {
    this.router.navigate(['calendarDemo']);
  }

  goCalendarWithHolidayDemo() {
    this.router.navigate(['calendarWithHolidayDemo']);
  }

  goHebrewCalendarWithHolidayDemo() {
    this.router.navigate(['hebrewCalendarWithHolidayDemo']);
  }
}
