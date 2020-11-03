import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { DemoHebrewWithHolidayCalendarModule } from './demo/module';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { DemoUtilsModule } from './demo-utils/module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    DemoUtilsModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    DemoHebrewWithHolidayCalendarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }