import { Component } from '@angular/core';
import { CalendarWeekViewComponent } from 'angular-calendar';

@Component({
  selector: 'custom-week-view',
  templateUrl: 'custom-week-view.component.html',
})
export class CustomWeekView extends CalendarWeekViewComponent { }