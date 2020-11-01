import {
    Component,
    ChangeDetectionStrategy,
    OnInit,
    ChangeDetectorRef,
    ViewEncapsulation,
    EventEmitter,
    Output,
} from '@angular/core';
import {
    CalendarDateFormatter,
    CalendarMonthViewBeforeRenderEvent,
    CalendarWeekViewBeforeRenderEvent,
    CalendarDayViewBeforeRenderEvent,
    CalendarView,
    DAYS_OF_WEEK,
    CalendarEvent,
    CalendarEventTimesChangedEvent,
} from 'angular-calendar';
import { colors } from '../demo-utils/colors';


import { CustomDateFormatter } from '../demo-utils/custom-date-formatter.provider';
import { HolidayService } from '../demo-utils/holiday/holiday.service';
import { CalendarEventWithMeta, HolidayEvent } from '../demo-utils/calendar-event-with-meta.type';
import { EventTypes } from '../demo-utils/event-types';
import { isSameMonth, isSameDay } from 'date-fns';
import { Subject } from 'rxjs';

@Component({
    selector: 'demo-component',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None, // hack to get the styles to apply locally
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

    // @Output() highlightDay: EventEmitter<CalendarEventWithMeta> = new EventEmitter<CalendarEventWithMeta>();
    // @Output() unhighlightDay: EventEmitter<CalendarEventWithMeta> = new EventEmitter<CalendarEventWithMeta>();

    view: CalendarView = CalendarView.Month;

    viewDate = new Date();

    events: CalendarEventWithMeta[] = [];

    externalEvents: CalendarEventWithMeta[] = [];

    holidays: HolidayEvent[] = [];


    locale: string = 'he';

    weekStartsOn: number = DAYS_OF_WEEK.MONDAY;

    weekendDays: number[] = [DAYS_OF_WEEK.FRIDAY, DAYS_OF_WEEK.SATURDAY];

    CalendarView = CalendarView;

    activeDayIsOpen: boolean = true;

    refresh: Subject<any> = new Subject();

    ngOnInit(): void {
        this.getExternalEvents();
        this.gethHolidays();
        this.getEvents();
    }

    private getExternalEvents() {
        this.externalEvents = [
            {
                title: 'Event 1',
                color: colors.yellow,
                start: new Date(),
                draggable: true,
            },
            {
                title: 'Event 2',
                color: colors.blue,
                start: new Date(),
                draggable: true,
            },
        ];
    }

    private getEvents() {
        this.events = [
            {
                title: 'Editable event',
                color: colors.yellow,
                start: new Date(),
                actions: [
                    {
                        label: '<i class="fas fa-fw fa-pencil-alt"></i>',
                        onClick: ({ event }: { event: CalendarEvent }): void => {
                            console.log('Edit event', event.id);
                        },
                    },
                ],
            },
            {
                title: 'Deletable event',
                color: colors.red,
                start: new Date(),
                actions: [
                    {
                        label: '<i class="fas fa-fw fa-trash-alt"></i>',
                        onClick: ({ event }: { event: CalendarEvent }): void => {
                            this.events = this.events.filter((iEvent) => iEvent !== event);
                            console.log('Event deleted', event);
                        },
                    },
                ],
            },
            {
                title: 'Non editable and deletable event',
                color: colors.green,
                start: new Date(),
            },
            {
                start: new Date(),
                title: 'event',
                allDay: true,
                color: colors.purple,
                meta: {
                    id: 1,
                    type: EventTypes.Normal,
                }
            },
            {
                title: 'Draggable event',
                color: colors.blue,
                start: new Date(),
                draggable: true,
            },
            {
                title: 'A non draggable event',
                color: colors.red,
                start: new Date(),
            },
        ];

        // console.log(this.events);
    }

    private gethHolidays() {
        this.holidayService.getHolidays()
            .subscribe(({ holidays }) => {
                this.holidays = holidays.map((holiday) => {
                    return {
                        start: new Date(holiday.date),
                        title: holiday.name,
                        allDay: true,
                        meta: {
                            type: EventTypes.Holiday,
                        },
                    };
                });
                let today = new Date()
                let tomorrow = new Date(today)
                tomorrow.setDate(tomorrow.getDate() + 1)
                this.holidays.push(
                    {
                        start: tomorrow,
                        title: 'november 2 holiday',
                        allDay: true,
                        meta: {
                            type: EventTypes.Holiday,
                        }
                    }
                )

                this.cdr.markForCheck();
            });
    }

    setView(view: CalendarView) {
        this.view = view;
    }

    eventClicked({ event }: { event: CalendarEvent }): void {
        console.log('Event clicked', event);
        console.log('Event type', event.meta?.type);
    }

    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
        console.log('dayClicked: ' + date.getDate());
        if (isSameMonth(date, this.viewDate)) {
            if (
                (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
                events.length === 0
            ) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
            }
            this.viewDate = date;
        }
    }

    getHolidayTitle(date: Date) {
        // console.log(date);
        let holiday = this.holidays.find(event =>
            event.start.getDate() == date.getDate() &&
            event.start.getMonth() == date.getMonth() &&
            event.start.getFullYear() == date.getFullYear());
        if (holiday) {
            return this.holidayService.getHebrewName(holiday.title);
        }
        else
            return '';

    }

    externalDrop(event: CalendarEvent) {
        if (this.externalEvents.indexOf(event) === -1) {
            this.events = this.events.filter((iEvent) => iEvent !== event);
            this.externalEvents.push(event);
        }
    }

    eventTimesChanged({
        event,
        newStart,
        newEnd,
        allDay,
    }: CalendarEventTimesChangedEvent): void {
        const externalIndex = this.externalEvents.indexOf(event);
        if (typeof allDay !== 'undefined') {
            event.allDay = allDay;
        }
        if (externalIndex > -1) {
            this.externalEvents.splice(externalIndex, 1);
            this.events.push(event);
        }
        event.start = newStart;
        if (newEnd) {
            event.end = newEnd;
        }
        if (this.view === 'month') {
            this.viewDate = newStart;
            this.activeDayIsOpen = true;
        }
        this.events = [...this.events];
    }

    // eventTimesChanged({
    //     event,
    //     newStart,
    //     newEnd,
    // }: CalendarEventTimesChangedEvent): void {
    //     event.start = newStart;
    //     event.end = newEnd;
    //     this.refresh.next();
    // }

    beforeMonthViewRender(renderEvent: CalendarMonthViewBeforeRenderEvent): void {
        renderEvent.body.forEach((day) => {
            const dayOfMonth = day.date.getDate();
            const date = day.date;
            if (this.holidays.find(o => o.start.getDate() == date.getDate() && o.start.getMonth() == date.getMonth() && o.start.getFullYear() == date.getFullYear())) {
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

