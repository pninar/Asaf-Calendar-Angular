import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DemoCalendarWithHolidayComponent } from './demo-with-holiday/component';
import { DemoCalendarComponent } from './demo/component';
import { DemoHebrewWithHolidayComponent } from './demo-hebrew-with-holiday/component';

const routes: Routes = [
  { path: 'calendarDemo', component: DemoCalendarComponent },
  { path: 'calendarWithHolidayDemo', component: DemoCalendarWithHolidayComponent },
  { path: 'hebrewCalendarWithHolidayDemo', component: DemoHebrewWithHolidayComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
