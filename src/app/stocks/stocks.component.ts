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
        type: "area",
        pointInterval: 24 * 3600 * 1000,
        pointStart: Date.UTC(2020, 0, 1),
        data: this.data
      }
    ]
  };
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
      ////////////////last

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
        // console.log(
        //   i + "," + parsedDate[0][parsedDate[0].length - i - 1],
        //   data.values[i].datetime
        // );
        // var chk = parsedDate[0][dc].split("-");
        // var diffsplit = data.values[i].datetime.split("-");
        // var diff = chk[2] - diffsplit[2];
        //////////
        var date1 = new Date(parsedDate[0][parsedDate[0].length - i - 1]);
        var date2 = new Date(data.values[i].datetime);
        var Difference_In_Time = date1.getTime() - date2.getTime();
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        console.log(
          "Total number of days between dates" +
            date1 +
            "and " +
            date2 +
            " is:" +
            Difference_In_Days
        );
        //////////
        // if (diff == 0) {
        //   this.data.push(data.values[i].close);
        // } else {
        //   for (let j = 1; j <= diff; j++) {
        //     this.data.push(Number(0));
        //   }
        // }
        dc = dc + 1;
      }
      //////last

      // for (let i = 0; i < data.values.length; i++) {
      //   this.data.push(Number(data.values[i].close));
      // }
      var l = data.values.length - 1;
      var date = data.values[l].datetime.split("-");
      date[1] = date[1] - 1;
      /////////
      // this.data.push(Number(data.values[0].close));
      // for (let i = 1; i < data.values.length; i++) {
      //   var dt = data.values[i].datetime.split("-");
      //   var dt1 = data.values[i - 1].datetime.split("-");
      //   if (dt[2] - dt1[2] != 1) {
      //     switch (dt[1]) {
      //       case 1:
      //         if (dt[2] >= 1 && dt[2] <= 31) {
      //           this.data.push(0);
      //         }
      //         console.log("January");
      //         break;
      //       case 2:
      //         console.log("February");
      //       case 3:

      //       case 4:

      //       case 5:

      //       case 6:

      //       case 7:

      //       case 8:

      //       case 9:

      //       case 10:

      //       case 11:

      //       case 12:
      //     }
      //   } else {
      //     this.data.push(Number(data.values[i].close));
      //   }
      // }
      /////////
      setTimeout(() => {
        this.chartOptions.series[0] = {
          type: "area",
          data: this.data,
          pointStart: Date.UTC(date[0], date[1], date[2])
        };
        this.updateFlag = true;
      }, 500);
    });
  }
  ngOnInit() {
    this.handleUpdate("ALEAF", "1day");
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
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    var selectedId = selectedNodes.map(node => node.data.symbol);
    if (selectedId == undefined || selectedId.length == 0) {
      alert("Please, select any one stock!!!");
    } else {
      this.handleUpdate(selectedId, "1day");
    }
    console.log(selectedId);
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
