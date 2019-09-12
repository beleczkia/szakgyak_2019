import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OdataServiceService {
  constructor(private http: HttpClient) { }

  configUrl = '/hana/index.xsjs';

  getData(params) {
    console.log(params);
    return this.http.get(this.configUrl + params);
  }

}
