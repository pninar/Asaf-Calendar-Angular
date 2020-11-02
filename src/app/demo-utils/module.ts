import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'angular-calendar';
import { CalendarHeaderComponent } from './calendar-header.component';
import { CustomWeekView } from './custom-week-view.component';

@NgModule({
    imports: [CommonModule, FormsModule, CalendarModule],
    declarations: [CalendarHeaderComponent, CustomWeekView],
    exports: [CalendarHeaderComponent, CustomWeekView],
})
export class DemoUtilsModule { }
