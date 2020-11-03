import { registerLocaleData } from '@angular/common';
import localHe from '@angular/common/locales/he';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { DemoUtilsModule } from '../demo-utils/module';
import { DemoHebrewWithHolidayComponent } from './component';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

registerLocaleData(localHe);

@NgModule({
    imports: [
        CommonModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
        }),
        DemoUtilsModule,
    ],
    declarations: [DemoHebrewWithHolidayComponent],
    exports: [DemoHebrewWithHolidayComponent],
})
export class DemoHebrewWithHolidayCalendarModule { }
