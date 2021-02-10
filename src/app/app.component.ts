import { Component, OnInit } from "@angular/core";
import $ from "jquery";
@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  menu = "home";
  constructor() {}
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
  }
}
