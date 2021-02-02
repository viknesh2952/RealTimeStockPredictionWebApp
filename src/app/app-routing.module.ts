import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { NotfoundComponent } from "./notfound/notfound.component";

const routes: Routes = [
  // { path:  '', redirectTo:'Login' , pathMatch:'full'},
  { path: "NotFound", component: NotfoundComponent },
  { path: "**", component: NotfoundComponent } // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
