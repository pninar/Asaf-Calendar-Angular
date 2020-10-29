import {
    Component,
    ChangeDetectionStrategy,
    OnInit,
    ChangeDetectorRef,
    ViewEncapsulation,
} from '@angular/core';
import {
    CalendarDateFormatter,
    CalendarMonthViewBeforeRenderEvent,
    CalendarWeekViewBeforeRenderEvent,
    CalendarDayViewBeforeRenderEvent,
    CalendarView,
    DAYS_OF_WEEK,
} from 'angular-calendar';


import { CustomDateFormatter } from '../demo-utils/custom-date-formatter.provider';
import { HolidayService } from '../demo-utils/holiday/holiday.service';
import { CalendarEventWithMeta } from '../demo-utils/calendar-event-with-meta.type';

@Component({
    selector: 'demo-component',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    templateUrl: 'template.html',
    providers: [
        {
            provide: CalendarDateFormatter,
            useClass: CustomDateFormatter,
        },
    ],
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
export class DemoHebrewWithHolidayComponent implements OnInit {
    constructor(private holidayService: HolidayService,
        private cdr: ChangeDetectorRef) { }

    view: CalendarView = CalendarView.Month;

    viewDate = new Date();

    events: CalendarEventWithMeta[] = [];

    locale: string = 'he';

    weekStartsOn: number = DAYS_OF_WEEK.MONDAY;

    weekendDays: number[] = [DAYS_OF_WEEK.FRIDAY, DAYS_OF_WEEK.SATURDAY];

    CalendarView = CalendarView;

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
                            type: 'holiday',
                            holiday,
                        },
                    };
                });
                console.log(this.events);
                this.cdr.markForCheck();
            });
    }

    setView(view: CalendarView) {
        this.view = view;
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

