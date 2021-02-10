import { Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
// import * as Highcharts from "highcharts";
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  constructor(private api: ApiService) {}
  // data = [
  //   {
  //     name: "ItSolutionStuff.com",
  //     data: [500, 700, 555, 444, 777, 877, 944, 567, 666, 789, 456, 654]
  //   },
  //   {
  //     name: "Nicesnippets.com",
  //     data: [677, 455, 677, 877, 455, 778, 888, 567, 785, 488, 567, 654]
  //   }
  // ];

  // highcharts = Highcharts;
  // chartOptions = {
  //   chart: {
  //     type: "spline"
  //   },
  //   title: {
  //     text: "Monthly Site Visitor"
  //   },
  //   xAxis: {
  //     categories: [
  //       "Jan",
  //       "Feb",
  //       "Mar",
  //       "Apr",
  //       "May",
  //       "Jun",
  //       "Jul",
  //       "Aug",
  //       "Sep",
  //       "Oct",
  //       "Nov",
  //       "Dec"
  //     ]
  //   },
  //   yAxis: {
  //     title: {
  //       text: "Visitors"
  //     }
  //   },
  //   series: this.data
  // };
  ngOnInit() {
    this.api.getHomeChart().subscribe((data: any) => {
      console.log(data);
    });
  }
}
