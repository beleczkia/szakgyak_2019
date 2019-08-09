import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OdataService {
  private _year        : number = 2010;
  private _configUrl   : string = "/hana/tarsasag.xsodata/";
  private _defaultUrl  : string = `tarsasag?$filter=ASZ_EVE eq ${this._year}`;
  private _areaUrl     : string = null
  private _regionName  : string = null;
  private _countyName  : string = null;
  private _cityName    : string = null;

  private _areaSubject: BehaviorSubject<string> = 
    new BehaviorSubject<string>(this._areaUrl);

  private _regionSubject: BehaviorSubject<string> = 
    new BehaviorSubject<string>(null);

  private _countySubject: BehaviorSubject<string> = 
    new BehaviorSubject<string>(null);

  private _citySubject: BehaviorSubject<string> = 
    new BehaviorSubject<string>(null);

  private _yearSubject: BehaviorSubject<number> = 
    new BehaviorSubject<number>(2010);

  constructor(private http: HttpClient) {}

  // TODO
  setAreaUrl(url: string): void {
    this._areaUrl = url;
    this._areaSubject.next(url);
  }

  getDefaultUrl(): string {
    return this._defaultUrl;
  }

  getYearSubject(): Observable<number> {
    return this._yearSubject.asObservable();
  }

  setYear(n): void {
    this._year = n;
    this.calculateAreaUrl();
    this._yearSubject.next(n);
  }

  getRegionSubject(): Observable<string> {
    return this._regionSubject.asObservable();
  }

  getRegionName(): string {
    return this._regionName;
  }

  setRegionName(name: string): void {
    console.log("setRegionName:", name);
    this._regionName = name;
    this._regionSubject.next(this._regionName);
    this._countyName = null;
    this._cityName = null;
    this.calculateAreaUrl();
    this._areaSubject.next(this._areaUrl);
  }

  getCountySubject(): Observable<string> {
    return this._countySubject.asObservable();
  }

  getCountyName(): string {
    return this._countyName;
  }

  setCountyName(name: string): void {
    console.log("setCountyName:", name);
    this._cityName = null;
    this._countyName = name;
    this._countySubject.next(this._countyName);
    let oldUrl = this._areaUrl;
    this.calculateAreaUrl();
    if (oldUrl != this._areaUrl) {
      this._areaSubject.next(this._areaUrl);
    }
  }

  getCityName(): string {
    return this._cityName;
  }

  setCityName(name: string): void {
    console.log("setCityName:", name);
    this._cityName = name;
    this._citySubject.next(this._cityName);
    let oldUrl = this._areaUrl;
    this.calculateAreaUrl();
    if (oldUrl != this._areaUrl) {
      this._areaSubject.next(this._areaUrl);
    }
  }

  getCitySubject(): Observable<string> {
    return this._citySubject.asObservable();
  }

  /* Calculate the smallest selected area */
  private calculateAreaUrl(): void {
    if (this._regionName === null) {
      return;
    } else if (this._countyName === null) {
      this._areaUrl = `tarsasag?$filter=ASZ_EVE eq ${this._year}` + 
        ` and regio eq '${this._regionName}'`;
    } else if (this._cityName === null) {
      this._areaUrl = `tarsasag?$filter=ASZ_EVE eq ${this._year}` + 
        ` and megye eq '${this._countyName}'`;
    } else {
      this._areaUrl = `tarsasag?$filter=ASZ_EVE eq ${this._year}` + 
        ` and telepules eq '${this._cityName}'`;
    }
  }

  getAreaSubject(): Observable<string> {
    return this._areaSubject.asObservable();
  }

  getAreaUrl(): string { 
    return this._areaUrl;
  }

  getData(params) {
    console.log(this._configUrl + params);
    return this.http.get(this._configUrl + params);
  }

  getRegionData() {
    return this.getData(
      `REGIONS?$filter=EV eq ${this._year}&$format=json`);
  }

  getCountyData() {
    return this.getData(
      `COUNTIES?$filter=EV eq ${this._year} and REGIO eq '${this._regionName}'`);
  }

  getCityData(name: string) {
    return this.getData(
      `CITIES?$filter=EV eq ${this._year} and MEGYE eq '${name}'`);
  }

  /* Return all companies in the smallest selected area */
  getCompanyData(searchArg: string) {
    let regionFilter: string = "";
    let countyFilter: string = "";
    let cityFilter: string = "";
    let query: string = "";

    if (this._regionName != null) {
      regionFilter = ` and regio eq '${this._regionName}' `;
    }
    if (this._countyName != null) {
      countyFilter = `and megye eq '${this._countyName}' `;
    }
    if (this._cityName != null) {
      cityFilter = `and telepules eq '${this._cityName}' `;
    }

    query += "tarsasag?$orderby=TARS_ROV_NEV&$filter=ASZ_EVE eq " + 
      this._year + regionFilter + countyFilter + cityFilter;

    if (searchArg != undefined) {
      query += " and " + searchArg;
    }

    return this.getData(query);
  }

  // deselect all options
  resetData(): void {
    this.setCityName(null);
    this.setCountyName(null);
    this.setRegionName(null);
    this.setAreaUrl(this._defaultUrl);
    // console.log(this._year);
    console.log(this._areaUrl);
  }
}
