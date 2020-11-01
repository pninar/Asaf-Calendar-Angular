import { CalendarEvent } from 'angular-calendar';
import { Holiday } from './holiday/holiday.interface';
import { EventTypes } from './event-types';

export type CalendarEventWithMeta = CalendarEvent<
    { type: EventTypes, id: number }
>;

export type HolidayEvent = CalendarEvent<
    { type: EventTypes.Holiday }
>;

export type NormalEvent = CalendarEvent<
    { type: EventTypes.Normal }
>;



