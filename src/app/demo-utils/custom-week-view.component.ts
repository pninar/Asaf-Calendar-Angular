import { AfterViewInit, Component } from '@angular/core';
import { CalendarWeekViewComponent } from 'angular-calendar';
import { roundToNearest, getMinutesMoved, addDaysWithExclusions } from 'angular-calendar/modules/common/util';
import {
  WeekDay,
  CalendarEvent,
  WeekViewAllDayEvent,
  WeekView,
  ViewPeriod,
  WeekViewHourColumn,
  WeekViewTimeEvent,
  WeekViewHourSegment,
  WeekViewHour,
  WeekViewAllDayEventRow,
} from 'calendar-utils';
import {
  DragEndEvent,
  DropEvent,
  DragMoveEvent,
  ValidateDrag,
} from 'angular-draggable-droppable';

@Component({
  selector: 'custom-week-view',
  templateUrl: 'custom-week-view.component.html',
})
export class CustomWeekView extends CalendarWeekViewComponent implements AfterViewInit {
  isRtl: boolean = true;
  ngAfterViewInit(): void {
    // this.isRtl = getComputedStyle(this.element.nativeElement).direction === 'rtl'
  }


}