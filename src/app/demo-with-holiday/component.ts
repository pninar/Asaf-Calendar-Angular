import {
    Component,
    ChangeDetectionStrategy,
    OnInit,
    ChangeDetectorRef,
    ViewEncapsulation,
} from '@angular/core';
// import { CalendarEvent, CalendarView } from 'angular-calendar';
import { HttpClient } from '@angular/common/http';
import { startOfYear, subYears } from 'date-fns';
import { HolidayService } from './holiday.service';


import {
    CalendarEvent,
    CalendarMonthViewBeforeRenderEvent,
    CalendarWeekViewBeforeRenderEvent,
    CalendarDayViewBeforeRenderEvent,
    CalendarView,
} from 'angular-calendar';

// get your own key from https://holidayapi.com/
const HOLIDAY_API_KEY = 'fc620f1b-f052-4d1c-b537-47e5d44a892a';

// change this to your own country
const COUNTRY_CODE = 'IL';

interface Holiday {
    date: string;
    name: string;
}

type CalendarEventWithMeta = CalendarEvent<
    { type: 'holiday'; holiday: Holiday } | { type: 'normal' }
>;

@Component({
    selector: 'demo-with-holday-component',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
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


    constructor(private http: HttpClient,
        private holidayService: HolidayService,
        private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.fetchHolidays();
    }

    private fetchHolidays() {
        this.http
            .get<{ holidays: Holiday[] }>('https://holidayapi.com/v1/holidays',
                {
                    params: {
                        country: COUNTRY_CODE,
                        year: String(new Date().getFullYear() - 1),
                        key: HOLIDAY_API_KEY,
                    },
                })
            .subscribe(({ holidays }) => {
                this.events = holidays.map((holiday) => {
                    return {
                        start: new Date(holiday.date),
                        title: holiday.name,
                        allDay: true,
                        meta: {
                            type: 'holiday',
                            holiday,
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
