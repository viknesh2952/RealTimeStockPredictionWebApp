import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class ApiService {
  link = "https://api.twelvedata.com/time_series";
  apikey = "e4a53dc2e6214b7c9b9763713d9cfda5";
  constructor(private http: HttpClient) {}
  getStocksList() {
    return this.http.get("https://api.twelvedata.com/stocks?source=account");
  }
  getExchangesList() {
    return this.http.get(
      "https://api.twelvedata.com/exchanges?type=stock&source=account"
    );
  }
  getIndicesList() {
    return this.http.get("https://api.twelvedata.com/indices?source=account");
  }
  getChart(stock, duration) {
    return this.http.get(
      `${this.link}?symbol=${stock}&interval=${duration}&apikey=${this.apikey}`
    );
  }
}
