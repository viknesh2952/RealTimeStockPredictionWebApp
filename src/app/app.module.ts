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
import { HighchartsChartModule } from "highcharts-angular";
@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    AgGridModule.withComponents([]),
    HttpClientModule,
    HighchartsChartModule
  ],
  declarations: [
    AppComponent,
    HelloComponent,
    NotfoundComponent,
    HomeComponent,
    StocksComponent
  ],
  bootstrap: [AppComponent],
  providers: [ApiService]
})
export class AppModule {}
