import { Component, OnInit } from "@angular/core";
import $ from "jquery";
@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  ngOnInit() {
    $(document).ready(() => {
      $(window).scroll(function() {
        if ($(document).scrollTop() > 50) {
          $(".nav").addClass("affix");
        } else {
          $(".nav").removeClass("affix");
        }
      });
      $(".navTrigger").click(function() {
        $(this).toggleClass("active");
        $("#mainListDiv").toggleClass("show_list");
        $("#mainListDiv").fadeIn();
      });
    });
  }
}
