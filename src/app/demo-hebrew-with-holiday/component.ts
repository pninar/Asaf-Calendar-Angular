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
    CalendarMonthViewDay,
} from 'angular-calendar';
import { colors } from '../demo-utils/colors';


import { CustomDateFormatter } from '../demo-utils/custom-date-formatter.provider';
import { HolidayService } from '../demo-utils/holiday/holiday.service';
import { CalendarEventWithMeta, HolidayEvent } from '../demo-utils/calendar-event-with-meta.type';
import { EventTypes } from '../demo-utils/event-types';
import { Subject } from 'rxjs';
import { isSameMinute } from 'date-fns';
import { startOfDay } from 'date-fns/fp';

interface EventGroupMeta {
    type: string;
}

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

    groupedSimilarEvents: CalendarEvent[] = [];

    locale: string = 'he';

    weekStartsOn: number = DAYS_OF_WEEK.MONDAY;

    weekendDays: number[] = [DAYS_OF_WEEK.FRIDAY, DAYS_OF_WEEK.SATURDAY];

    CalendarView = CalendarView;

    activeDayIsOpen: boolean = true;

    refresh: Subject<any> = new Subject();

    ngOnInit(): void {
        this.gethHolidays();
        this.getExternalEvents();
        this.getEvents();
        this.groupSimilarEvents();
    }

    private groupSimilarEvents() {
        // group any events together that have the same type and dates
        // use for when you have a lot of events on the week or day view at the same time
        this.groupedSimilarEvents = [];
        const processedEvents = new Set();
        this.events.forEach((event) => {
            if (processedEvents.has(event)) {
                return;
            }
            const similarEvents = this.events.filter((otherEvent) => {
                return (
                    otherEvent !== event &&
                    !processedEvents.has(otherEvent) &&
                    isSameMinute(otherEvent.start, event.start) &&
                    (isSameMinute(otherEvent.end, event.end) ||
                        (!otherEvent.end && !event.end)) &&
                    otherEvent.color.primary === event.color.primary &&
                    otherEvent.color.secondary === event.color.secondary
                );
            });
            processedEvents.add(event);
            similarEvents.forEach((otherEvent) => {
                processedEvents.add(otherEvent);
            });
            if (similarEvents.length > 0) {
                this.groupedSimilarEvents.push({
                    title: `${similarEvents.length + 1} events`,
                    color: event.color,
                    start: event.start,
                    end: event.end,
                    meta: {
                        groupedEvents: [event, ...similarEvents],
                    },
                });
            } else {
                this.groupedSimilarEvents.push(event);
            }
        });
    }

    private getExternalEvents() {
        this.externalEvents = [
            {
                title: 'External Draggable Event 1 - Warning',
                color: colors.yellow,
                start: new Date(),
                draggable: true,
                meta: {
                    id: -1,
                    type: EventTypes.Warning,
                },
            },
            {
                title: 'External Draggable Event 2 - Info',
                color: colors.blue,
                start: new Date(),
                draggable: true,
                meta: {
                    id: -1,
                    type: EventTypes.Info,
                },
            },
        ];
    }

    private getEvents() {
        this.events = [
            {
                title: 'Event 1 - Warning',
                color: colors.yellow,
                start: startOfDay(new Date()),
                meta: {
                    id: -1,
                    type: EventTypes.Warning,
                },
            },
            {
                title: 'Event 2- Warning',
                color: colors.yellow,
                start: startOfDay(new Date()),
                meta: {
                    id: -1,
                    type: EventTypes.Warning,
                },
            },
            {
                title: 'Event 3 - Info, draggable',
                color: colors.blue,
                start: startOfDay(new Date()),
                draggable: true,
                meta: {
                    id: -1,
                    type: EventTypes.Info,
                },
            },
            {
                title: 'Event 4 - Danger',
                color: colors.red,
                start: startOfDay(new Date()),
                meta: {
                    id: -1,
                    type: EventTypes.Danger,
                },
            },
            {
                title: 'Event 5 - Danger',
                color: colors.red,
                start: startOfDay(new Date()),
                meta: {
                    id: -1,
                    type: EventTypes.Danger,
                },
            },
        ];
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

    // dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    //     console.log('dayClicked: ' + date.getDate());
    //     if (isSameMonth(date, this.viewDate)) {
    //         if (
    //             (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
    //             events.length === 0
    //         ) {
    //             this.activeDayIsOpen = false;
    //         } else {
    //             this.activeDayIsOpen = true;
    //         }
    //         this.viewDate = date;
    //     }
    // }

    dayClicked(day: CalendarMonthViewDay): void {
        console.log('dayClicked: ' + day.date);
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

    // beforeMonthViewRender(renderEvent: CalendarMonthViewBeforeRenderEvent): void {
    //     renderEvent.body.forEach((day) => {
    //         const dayOfMonth = day.date.getDate();
    //         const date = day.date;
    //         if (this.holidays.find(o => o.start.getDate() == date.getDate() && o.start.getMonth() == date.getMonth() && o.start.getFullYear() == date.getFullYear())) {
    //             day.cssClass = 'bg-pink';
    //         }
    //     });
    // }

    colorHolidays(day: CalendarMonthViewDay) {
        const dayOfMonth = day.date.getDate();
        const date = day.date;
        if (this.holidays.find(o => o.start.getDate() == date.getDate() && o.start.getMonth() == date.getMonth() && o.start.getFullYear() == date.getFullYear())) {
            day.cssClass = 'bg-pink';
        }
    }

    totalGroups(day: CalendarMonthViewDay) {
        const groups = {};
        day.events.forEach((event: CalendarEvent<EventGroupMeta>) => {
            groups[event.meta.type] = groups[event.meta.type] || [];
            groups[event.meta.type].push(event);
        });
        day['eventGroups'] = Object.entries(groups);
    }

    beforeMonthViewRender({
        body,
    }: {
        body: CalendarMonthViewDay<EventGroupMeta>[];
    }): void {
        // month view has a different UX from the week and day view so we only really need to group by the type
        body.forEach((day) => {
            this.colorHolidays(day);
            this.totalGroups(day);
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

