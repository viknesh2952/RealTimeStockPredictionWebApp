import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AppComponent } from "./app.component";
import { HelloComponent } from "./hello.component";
import { AgGridModule } from "ag-grid-angular";
import { ApiService } from "./api.service";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { NotfoundComponent } from "./notfound/notfound.component";

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    AgGridModule.withComponents([]),
    HttpClientModule
  ],
  declarations: [AppComponent, HelloComponent, NotfoundComponent],
  bootstrap: [AppComponent],
  providers: [ApiService]
})
export class AppModule {}
