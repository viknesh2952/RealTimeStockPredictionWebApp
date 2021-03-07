import { Component, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../api.service";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { MenuModule } from "@ag-grid-enterprise/menu";
import { ColumnsToolPanelModule } from "@ag-grid-enterprise/column-tool-panel";
import * as Highcharts from "highcharts/highstock";
import { AgGridAngular } from "ag-grid-angular";
@Component({
  selector: "app-stocks",
  templateUrl: "./stocks.component.html",
  styleUrls: ["./stocks.component.css"]
})
export class StocksComponent implements OnInit {
  @ViewChild("agGrid") agGrid: AgGridAngular;
  updateFlag = false;
  data = [];
  rowData;
  enableplot = false;
  table = "Exchanges";
  gridOptions = {
    columnDefs: "columnDefs",
    rowData: "rowData",
    rowSelection: "multiple",
    defaultColDef: "defaultColDef",
    colResizeDefault: "colResizeDefault"
  };
  public modules: any[] = [
    ClientSideRowModelModule,
    MenuModule,
    ColumnsToolPanelModule
  ];
  columnDefs = [];
  colResizeDefault;
  defaultColDef: {
    resizable: boolean;
    filter: boolean;
    floatingFilter: boolean;
    sortable: boolean;
  };
  predictedValue;
  smoothingValue;
  predDate: any;
  LastEMA: any;
  orgLen: any;
  orgData: any;
  startDate: any;
  constructor(private api: ApiService) {
    this.colResizeDefault = "shift";
    this.defaultColDef = {
      resizable: true,
      filter: true,
      floatingFilter: true,
      sortable: true
    };
  }
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
        name: "Original",
        type: "line",
        pointInterval: 24 * 3600 * 1000,
        pointStart: Date.UTC(2020, 0, 1),
        marker: {
          fillColor: "blue",
          lineColor: Highcharts.getOptions().colors[1]
        },
        data: this.data
      },
      {
        name: "Predicted-EMA",
        type: "line",
        pointInterval: 24 * 3600 * 1000,
        pointStart: Date.UTC(2020, 0, 1),
        marker: {
          fillColor: "red",
          lineColor: Highcharts.getOptions().colors[2]
        },
        data: [
          // 7.0,
          // 6.9,
          // 9.5,
          // 14.5,
          // 18.2,
          // 21.5,
          // 25.2,
          // 26.5,
          // 23.3,
          // 18.3,
          // 13.9,
          // 9.6
        ]
      }
    ]
  };
  handleUpdate(stock, interval, datatype) {
    this.api.getChart(stock, interval, datatype).subscribe((data: any) => {
      console.log(data);
      if (data.status == "error") {
        alert("This is not available.Please, select something!!!");
        return;
      }
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
      this.predDate = max;
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
        // console.log(
        //   //   "Total number of days between dates" +
        //   date1,
        //   //     "and " +
        //   date2
        //   //     " is:" +
        //   //     Difference_In_Days
        // );
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
      var l = data.values.length - 1;
      var date = data.values[l].datetime.split("-");
      this.startDate = date;
      date[1] = date[1] - 1;
      setTimeout(() => {
        this.chartOptions.series[0] = {
          type: "line",
          data: this.data,
          pointStart: Date.UTC(date[0], date[1], date[2])
        };
        this.updateFlag = true;
      }, 500);
      // console.log(this.data);
      this.SMA(5);
    });
  }
  SMA(timeperiod) {
    var dl = this.data.length - 1;
    var pr = 0;
    for (let j = dl; j > dl - timeperiod; j--) {
      pr = pr + this.data[j];
    }
    this.predictedValue = pr / timeperiod;
    this.EMA(timeperiod);
  }
  EMA(timeperiod) {
    if (this.LastEMA == undefined) {
      this.LastEMA = this.predictedValue;
    }
    this.smoothingValue = 2 / (timeperiod + 1);
    //EMA=(closing price − previous day’s EMA)× smoothing constant as a decimal + previous day’s EMA
    var result = [this.predictedValue];
    var dl = this.data.length - 1;
    for (let i = dl - timeperiod; i >= 0; i--) {
      var EMA =
        (this.data[i] - this.LastEMA) * this.smoothingValue + this.LastEMA;
      this.LastEMA = EMA;
      result.push(this.LastEMA);
    }
    for (let k = 0; k < timeperiod; k++) {
      result.push("");
    }
    result = result.reverse();
    console.log(result);
    console.log(this.startDate);
    this.chartOptions.series[1] = {
      type: "line",
      data: result,
      pointStart: Date.UTC(
        this.startDate[0],
        this.startDate[1],
        this.startDate[2]
      )
    };
  }
  ngOnInit() {
    this.handleUpdate("GOOGL", "1day", "real");
    this.columnDefs = [
      { field: "code" },
      { field: "country" },
      { field: "name" },
      { field: "timezone" }
    ];
    this.api.getExchangesList().subscribe((data: any) => {
      console.log(data);
      this.rowData = data.data;
    });
  }
  Plot(data) {
    this.data = [];
    if (data == "sample") {
      this.handleUpdate("SAMPLE", "1day", "sample");
    } else {
      const selectedNodes = this.agGrid.api.getSelectedNodes();
      var selectedId = selectedNodes.map(node => node.data.symbol);
      if (selectedId == undefined || selectedId.length == 0) {
        alert("Please, select any one stock!!!");
      } else {
        this.handleUpdate(selectedId, "1day", "real");
      }
      console.log(selectedId);
    }
  }
  getStocks() {
    this.columnDefs = [];
    this.columnDefs = [
      // {
      //   field: "action",
      //   cellRenderer: data => {
      //     return `<button (click)="Plot()">btn</button>`;
      //   }
      // },
      { field: "country" },
      { field: "currency" },
      { field: "exchange" },
      { field: "name" },
      { field: "symbol" },
      { field: "type" }
    ];
    this.enableplot = true;
    this.api.getStocksList().subscribe((data: any) => {
      console.log(data);
      this.rowData = data.data;
    });
    this.table = "Stocks";
  }
  getExchanges() {
    this.enableplot = false;
    this.columnDefs = [];
    this.columnDefs = [
      { field: "code" },
      { field: "country" },
      { field: "name" },
      { field: "timezone" }
    ];
    this.api.getExchangesList().subscribe((data: any) => {
      console.log(data);
      this.rowData = data.data;
    });
    this.table = "Exchanges";
  }
  getIndices() {
    this.enableplot = false;
    this.columnDefs = [];
    this.columnDefs = [
      { field: "country" },
      { field: "currency" },
      { field: "name" },
      { field: "symbol" }
    ];
    this.api.getIndicesList().subscribe((data: any) => {
      console.log(data);
      this.rowData = data.data;
    });
    this.table = "Indices";
  }
}
