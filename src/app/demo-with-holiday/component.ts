import {
    Component,
    ChangeDetectionStrategy,
    OnInit,
    ChangeDetectorRef,
    ViewEncapsulation,
} from '@angular/core';

import { startOfYear, subYears } from 'date-fns';
import { HolidayService } from '../demo-utils/holiday/holiday.service';
import { CalendarEventWithMeta } from '../demo-utils/calendar-event-with-meta.type';


import {
    CalendarMonthViewBeforeRenderEvent,
    CalendarWeekViewBeforeRenderEvent,
    CalendarDayViewBeforeRenderEvent,
    CalendarView,
} from 'angular-calendar';
import { EventTypes } from '../demo-utils/event-types';


@Component({
    selector: 'demo-with-holday-component',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None, // hack to get the styles to apply locally
    templateUrl: 'template.html',
    styles: [
        `
        .cal-month-view .bg-pink,
        .cal-week-view .cal-day-columns .bg-pink,
        .cal-day-view .bg-pink {
          background-color: hotpink !important;
        }
      `,
    ],
})


export class DemoCalendarWithHolidayComponent implements OnInit {
    view: CalendarView = CalendarView.Month;

    viewDate = startOfYear(subYears(new Date(), 1));

    events: CalendarEventWithMeta[] = [];


    constructor(private holidayService: HolidayService,
        private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.fetchHolidays();
    }

    private fetchHolidays() {
        this.holidayService.getHolidays()
            .subscribe(({ holidays }) => {
                this.events = holidays.map((holiday) => {
                    return {
                        start: new Date(holiday.date),
                        title: holiday.name,
                        allDay: true,
                        meta: {
                            id: 1,
                            type: EventTypes.Holiday,
                        },
                    };
                });
                console.log(this.events);
                this.cdr.markForCheck();
            });
    }

    getHolidayTitle(dayOfMonth: number, date: Date) {

        // console.log(date);
        let holiday = this.events.find(event =>
            event.start.getDate() == date.getDate() &&
            event.start.getMonth() == date.getMonth() &&
            event.start.getFullYear() == date.getFullYear());
        if (holiday) {
            console.log(holiday);
            return this.holidayService.getHebrewName(holiday.title);
        }
        else
            return '';

    }

    beforeMonthViewRender(renderEvent: CalendarMonthViewBeforeRenderEvent): void {
        renderEvent.body.forEach((day) => {
            const dayOfMonth = day.date.getDate();
            const date = day.date;
            if (this.events.find(o => o.start.getDate() == date.getDate() && o.start.getMonth() == date.getMonth() && o.start.getFullYear() == date.getFullYear())) {
                day.cssClass = 'bg-pink';
            }
        });
    }

    beforeWeekViewRender(renderEvent: CalendarWeekViewBeforeRenderEvent) {
        renderEvent.hourColumns.forEach((hourColumn) => {
            hourColumn.hours.forEach((hour) => {
                hour.segments.forEach((segment) => {
                    if (
                        segment.date.getHours() >= 2 &&
                        segment.date.getHours() <= 5 &&
                        segment.date.getDay() === 2
                    ) {
                        segment.cssClass = 'bg-pink';
                    }
                });
            });
        });
    }

    beforeDayViewRender(renderEvent: CalendarDayViewBeforeRenderEvent) {
        renderEvent.hourColumns.forEach((hourColumn) => {
            hourColumn.hours.forEach((hour) => {
                hour.segments.forEach((segment) => {
                    if (segment.date.getHours() >= 2 && segment.date.getHours() <= 5) {
                        segment.cssClass = 'bg-pink';
                    }
                });
            });
        });
    }
}
