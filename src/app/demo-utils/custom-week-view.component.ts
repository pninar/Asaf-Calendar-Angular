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
import { CalendarWeekViewHourSegmentComponent } from 'angular-calendar/modules/week/calendar-week-view-hour-segment.component';
import { addMinutes } from 'date-fns';

@Component({
  selector: 'custom-week-view',
  templateUrl: 'custom-week-view.component.html',
})
export class CustomWeekView extends CalendarWeekViewComponent implements AfterViewInit {
  hours = [8, 8, 8, 8, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10];


  getHourSegments(hour): CalendarWeekViewHourSegmentComponent[] {
    // console.log(hour);
    // segments: CalendarWeekViewHourSegmentComponent[]): CalendarWeekViewHourSegmentComponent[] {
    let x: CalendarWeekViewHourSegmentComponent[] = hour.segments;
    let y = hour.segments[0].date.getHours();
    // console.log(x);
    // console.log(y);
    // console.log(segments);
    // console.log(this.hours.filter(x => x == y));
    // console.log(this.hours.filter(x => x == y).length);


    let increment = 0;
    let r: CalendarWeekViewHourSegmentComponent[] = [];
    this.hours.filter(x => x == y).forEach(x => {
      let s = hour.segments[0];
      s.date = addMinutes(hour.segments[0].date, increment);
      // s.isStart = (increment == 0);
      r.push(s);
      increment += 10;
    })

    console.log(r);

    return r;
  }
  ngAfterViewInit(): void {
    // this.isRtl = getComputedStyle(this.element.nativeElement).direction === 'rtl'
  }


}