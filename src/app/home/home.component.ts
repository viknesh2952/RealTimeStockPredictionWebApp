import { Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import * as Highcharts from "highcharts/highstock";
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  updateFlag = false;
  data = [1];
  constructor(private api: ApiService) {}
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    title: {
      text: "Live Stocks"
    },
    xAxis: {
      type: "datetime"
    },
    yAxis: {
      title: {
        text: "Close Value"
      }
    },
    series: [
      {
        type: "area",
        pointInterval: 24 * 3600 * 1000,
        pointStart: Date.UTC(2020, 0, 1),
        data: this.data
      }
    ]
  };

  handleUpdate() {
    this.chartOptions.title = {
      text: "AAPL Stocks"
    };
    this.api.getHomeChart().subscribe((data: any) => {
      console.log(data);
      for (let i = 0; i < data.values.length; i++) {
        this.data.push(Number(data.values[i].close));
      }
      setTimeout(() => {
        this.chartOptions.series[0] = {
          type: "area",
          data: this.data
        };
        this.updateFlag = true;
      }, 500);
    });
  }
  ngOnInit() {
    this.handleUpdate();
  }
}
