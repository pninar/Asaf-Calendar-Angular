import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'calendar';

  constructor(public router: Router) {
  }

  ngOnInit(): void {
    this.goHebrewCalendarWithHolidayDemo();
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
