import { CalendarEvent } from 'angular-calendar';
import { Holiday } from './holiday/holiday.interface';

export type CalendarEventWithMeta = CalendarEvent<
    { type: 'holiday'; holiday: Holiday } | { type: 'normal' }
>;