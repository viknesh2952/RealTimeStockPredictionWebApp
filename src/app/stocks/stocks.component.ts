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
  emaPredictedValue: any;
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
        data: []
      },
      {
        name: "MACD",
        type: "line",
        pointInterval: 24 * 3600 * 1000,
        pointStart: Date.UTC(2020, 0, 1),
        marker: {
          fillColor: "green",
          lineColor: Highcharts.getOptions().colors[3]
        },
        data: []
      },
      {
        name: "Signal-Line",
        type: "line",
        pointInterval: 24 * 3600 * 1000,
        pointStart: Date.UTC(2020, 0, 1),
        marker: {
          fillColor: "orange",
          lineColor: Highcharts.getOptions().colors[4]
        },
        data: []
      }
    ]
  };
  EMACalc(timeperiod, orgData) {
    var dl = orgData.length - 1;
    var pr = 0;
    for (let j = dl; j > dl - timeperiod; j--) {
      pr = pr + orgData[j];
    }
    var smaPredictedValue = pr / timeperiod;
    var LastEMA = smaPredictedValue;
    var result = [smaPredictedValue];
    var smoothingValue = 2 / (timeperiod + 1);
    var dl = orgData.length - 1;
    for (let i = dl - timeperiod; i >= 0; i--) {
      var EMA = (orgData[i] - LastEMA) * smoothingValue + LastEMA;
      LastEMA = EMA;
      result.push(LastEMA);
    }
    for (let k = 0; k < timeperiod; k++) {
      result.push(null);
    }
    result = result.reverse();
    return result;
  }
  MACD() {
    var large = this.EMACalc(26, this.orgData);
    var small = this.EMACalc(12, this.orgData);
    var length = small.length - 1;
    var macd = [];
    var j = 0;
    // for (let i = 0; i <= 14; i++) {
    //   macd[i] = null;
    // }
    for (let i = 26 - 12; i < length; i++) {
      macd[j] = small[i] - large[j];
      j++;
    }
    var signalLine = this.EMACalc(9, macd);
    this.chartOptions.series[2] = {
      type: "line",
      data: macd,
      pointStart: Date.UTC(
        this.startDate[0],
        this.startDate[1],
        this.startDate[2]
      )
    };
    this.chartOptions.series[3] = {
      type: "line",
      data: signalLine,
      pointStart: Date.UTC(
        this.startDate[0],
        this.startDate[1],
        this.startDate[2]
      )
    };
  }
  handleUpdate(stock, interval) {
    this.api.getChart(stock, interval).subscribe((data: any) => {
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
      this.predDate = new Date(this.predDate);
      this.predDate.setDate(this.predDate.getDate() + 1);
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
      this.orgData = this.data;
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
    this.MACD();
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
      result.push(null);
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
    this.emaPredictedValue = result[result.length - 1];
  }
  ngOnInit() {
    this.handleUpdate("GOOGL", "1day");
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
  Plot() {
    this.data = [];
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    var selectedId = selectedNodes.map(node => node.data.symbol);
    if (selectedId == undefined || selectedId.length == 0) {
      alert("Please, select any one stock!!!");
    } else {
      this.handleUpdate(selectedId, "1day");
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
