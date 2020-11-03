import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DemoHebrewWithHolidayComponent } from './demo/component';

const routes: Routes = [

  { path: 'hebrewCalendarWithHolidayDemo', component: DemoHebrewWithHolidayComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
