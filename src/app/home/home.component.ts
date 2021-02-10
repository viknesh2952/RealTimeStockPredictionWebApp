import { Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { Chart } from "angular-highcharts";
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  constructor(private api: ApiService) {}
  chart = new Chart({
    chart: {
      type: "line"
    },
    title: {
      text: "Linechart"
    },
    credits: {
      enabled: false
    },
    series: [
      {
        name: "Line 1",
        data: [1, 2, 3]
      }
    ]
  });

  // add point to chart serie
  add() {
    this.chart.addPoint(Math.floor(Math.random() * 10));
  }
  ngOnInit() {
    this.api.getHomeChart().subscribe((data: any) => {
      console.log(data);
    });
  }
}
