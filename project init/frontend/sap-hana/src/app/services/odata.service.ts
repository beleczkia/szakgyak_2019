import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OdataService {
  private _year       : number = 2010;
  private _configUrl  : string = '/hana/tarsasag.xsodata/';
  private _defaultUrl : string = `tarsasag?$filter=ASZ_EVE eq ${this._year} and regio eq 'Dél-Alföld régió'`;
  private _areaUrl    : string = null
  private _regionName : string = "Dél-Alföld régió";
  private _countyName : string = null;
  private _cityName   : string = null;

  private _areaSubject: BehaviorSubject<string> = 
    new BehaviorSubject<string>(this._areaUrl);

  private _regionSubject: BehaviorSubject<string> = 
    new BehaviorSubject<string>("Dél-Alföld régió");

  private _countySubject: BehaviorSubject<string> = 
    new BehaviorSubject<string>("Bács-Kiskun");

  private _yearSubject: BehaviorSubject<number> = 
    new BehaviorSubject<number>(2010);

  constructor(private http: HttpClient) {}

  getDefaultUrl(): string {
    return this._defaultUrl;
  }

  getYear(): Observable<number> {
    return this._yearSubject.asObservable();
  }

  setYear(n): void {
    this._year = n;
    this._yearSubject.next(n);
  }

  getRegionSubject(): Observable<string> {
    return this._regionSubject.asObservable();
  }

  getRegionName(): string {
    return this._regionName;
  }

  setRegionName(name: string): void {
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
    this._cityName = null;
    this._countyName = name;
    this._countySubject.next(this._countyName);
    this.calculateAreaUrl();
    this._areaSubject.next(this._areaUrl);
  }

  getCityName(): string {
    return this._cityName;
  }

  setCityName(name: string): void {
    this._cityName = name;
    this.calculateAreaUrl();
    this._areaSubject.next(this._areaUrl);
  }

  /* Calculate the smallest selected area */
  private calculateAreaUrl(): void {
    if (this._countyName === null) {
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

  getData(params) {
    console.log(this._configUrl + params);
    return this.http.get(this._configUrl + params);
  }

  getRegionData() {
    return this.getData(
      `REGIONS?$filter=EV eq ${this._year}&$format=json`);
  }

  getCountyData(name: string) {
    return this.getData(
      `COUNTIES?$filter=EV eq ${this._year} and REGIO eq '${name}'`);
    this._countyName = name;
  }

  getCityData(name: string) {
    return this.getData(
      `CITIES?$filter=EV eq ${this._year} and MEGYE eq '${name}'`);
    this._cityName = name;
  }
}
