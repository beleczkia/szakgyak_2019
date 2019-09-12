import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpgetService {

  constructor(private http: HttpClient) { }

  getData(params) {
    console.log(params);
    return this.http.get(params);
  }
}
