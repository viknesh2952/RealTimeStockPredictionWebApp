import { Component, OnInit } from "@angular/core";
import $ from "jquery";
import { ApiService } from "./api.service";
@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  menu = "home";
  rowData;
  constructor(private api: ApiService) {}
  columnDefs = [
    { field: "code" },
    { field: "country" },
    { field: "name" },
    { field: "timezone" }
  ];
  route(menuname) {
    this.menu = menuname;
    if (this.menu != "Home") {
      $(".nav").addClass("affix");
    } else {
      $(".nav").removeClass("affix");
    }
  }
  ngOnInit() {
    $(document).ready(() => {
      if (this.menu == "Home") {
        $(window).scroll(function() {
          if ($(document).scrollTop() > 50) {
            $(".nav").addClass("affix");
          } else {
            $(".nav").removeClass("affix");
          }
        });
      } else {
        $(".nav").addClass("affix");
      }
      $(".navTrigger").click(function() {
        $(this).toggleClass("active");
        $("#mainListDiv").toggleClass("show_list");
        $("#mainListDiv").fadeIn();
      });
    });
    this.api.getExchangesList().subscribe((data: any) => {
      console.log(data);
      this.rowData = data.data;
    });
  }
}
