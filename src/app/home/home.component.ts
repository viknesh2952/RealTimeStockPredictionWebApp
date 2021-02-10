import { Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import * as Highcharts from "highcharts/highstock";
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  constructor(private api: ApiService) {}
  Highcharts: typeof Highcharts = Highcharts;

  chartOptions: Highcharts.Options = {
    series: [
      {
        type: "line",
        pointInterval: 24 * 3600 * 1000,
        data: [1, 21, 5, 4, 25]
      }
    ]
  };
  ngOnInit() {
    // this.api.getHomeChart().subscribe((data: any) => {
    //   console.log(data);
    // });
  }
}
