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
    title: {
      text: "Fruit Consumption"
    },
    xAxis: {
      type: "datetime"
    },
    yAxis: {
      title: {
        text: "Fruit eaten"
      }
    },
    series: [
      {
        type: "area",
        pointInterval: 24 * 3600 * 1000,
        pointStart: Date.UTC(2020, 0, 1),
        data: [
          29.9,
          71.5,
          106.4,
          129.2,
          144.0,
          176.0,
          135.6,
          148.5,
          216.4,
          194.1,
          95.6,
          54.4
        ]
      }
    ]
  };

  ngOnInit() {
    // this.api.getHomeChart().subscribe((data: any) => {
    //   console.log(data);
    // });
  }
}
