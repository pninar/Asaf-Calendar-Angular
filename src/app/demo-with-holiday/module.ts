import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { DemoUtilsModule } from '../demo-utils/module';
import { DemoCalendarWithHolidayComponent } from './component';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    imports: [
        CommonModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
        }),
        HttpClientModule,
        DemoUtilsModule,
    ],
    declarations: [DemoCalendarWithHolidayComponent],
    exports: [DemoCalendarWithHolidayComponent],
})
export class DemoCalendarWithHolidayModule { }
