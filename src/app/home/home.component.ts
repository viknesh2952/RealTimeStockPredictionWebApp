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
  data = [];
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
    this.api.getChart("ALEAF", "1day", "real").subscribe((data: any) => {
      console.log(data);
      this.chartOptions.title = {
        text:
          data.meta.symbol + " Stocks  - " + data.meta.exchange + " Exchange"
      };
      this.chartOptions.yAxis = {
        title: { text: "Close Value in " + data.meta.currency }
      };
      var l = data.values.length - 1;
      var min = data.values[l].datetime;
      var max = data.values[0].datetime;
      var parsedDate = [];
      var getDaysArray = function(start, end) {
        for (
          var arr = [], dt = new Date(start);
          dt <= end;
          dt.setDate(dt.getDate() + 1)
        ) {
          arr.push(new Date(dt));
        }
        return arr;
      };
      var daylist = getDaysArray(new Date(min), new Date(max));
      parsedDate.push(daylist.map(v => v.toISOString().slice(0, 10)));
      var dc = 0;
      for (let i = 0; i < data.values.length; i++) {
        var date1 = new Date(parsedDate[0][parsedDate[0].length - 1 - dc]);
        var date2 = new Date(data.values[i].datetime);
        var Difference_In_Time = date1.getTime() - date2.getTime();
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        if (Difference_In_Days == 0) {
          this.data.push(data.values[i].close * 1);
          dc = dc + 1;
        } else {
          for (let j = 1; j <= Difference_In_Days; j++) {
            this.data.push(data.values[i - 1].close * 1);
            dc = dc + 1;
          }
        }
      }
      this.data.push(data.values[data.values.length - 1].close * 1);
      this.data = this.data.reverse();
      ///note the last value from the data is not pushed to the diagram
      var l = data.values.length - 1;
      var date = data.values[l].datetime.split("-");
      date[1] = date[1] - 1;
      setTimeout(() => {
        this.chartOptions.series[0] = {
          type: "line",
          data: this.data,
          pointStart: Date.UTC(date[0], date[1], date[2])
        };
        this.updateFlag = true;
      }, 500);
    });
  }
  ngOnInit() {
    this.handleUpdate();
  }
}
