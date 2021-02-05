import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { NotfoundComponent } from "./notfound/notfound.component";
import { StocksComponent } from "./stocks/stocks.component";

const routes: Routes = [
  { path: "Home", component: HomeComponent },
  { path: "Stocks", component: StocksComponent },
  { path: "", redirectTo: "Home", pathMatch: "full" },
  { path: "NotFound", component: NotfoundComponent },
  { path: "**", component: NotfoundComponent } // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
