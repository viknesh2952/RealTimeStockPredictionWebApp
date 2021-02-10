import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AppComponent } from "./app.component";
import { HelloComponent } from "./hello.component";
import { AgGridModule } from "ag-grid-angular";
import "ag-grid-enterprise";
import { ApiService } from "./api.service";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { NotfoundComponent } from "./notfound/notfound.component";
import { HomeComponent } from "./home/home.component";
import { StocksComponent } from "./stocks/stocks.component";

import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import stock from 'highcharts/modules/stock.src';
import more from 'highcharts/highcharts-more.src';

export function highchartsModules() {
  // apply Highcharts Modules to this array
  return [stock, more];
}
@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    AgGridModule.withComponents([]),
    HttpClientModule,ChartModule
  ],
  declarations: [
    AppComponent,
    HelloComponent,
    NotfoundComponent,
    HomeComponent,
    StocksComponent
  ],
  bootstrap: [AppComponent],
  providers: [ApiService,
    { provide: HIGHCHARTS_MODULES, useFactory: highchartsModules }]
})
export class AppModule {}
