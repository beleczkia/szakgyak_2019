import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class OdataService {
  constructor(private http: HttpClient) { }

  configUrl = "/hana/odata.xsodata/";
  //  Tarsasag?$top=1000&$format=json&$orderby=JEGYZ_TOKE_ERT_HUF+desc

  getData(params) {
    return this.http.get(this.configUrl + params);
  }
}
