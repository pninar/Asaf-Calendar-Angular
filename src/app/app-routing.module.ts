import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DemoCalendarWithHolidayComponent } from './demo-with-holiday/component';
import { DemoCalendarComponent } from './demo/component';

const routes: Routes = [
  { path: 'calendarDemo', component: DemoCalendarComponent },
  { path: 'calendarWithHolidayDemo', component: DemoCalendarWithHolidayComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
