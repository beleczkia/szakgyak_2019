import { Component, OnInit } from '@angular/core';
import { OdataService } from '../services/odata.service';

@Component({
  selector: 'app-map',
  templateUrl: './Hungary_location_map.svg',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  regionName: string;
  countyName: string;

  mapRegions: Record<string, string[]> = {
    "Dél-Alföld régió"         : ["Bács-Kiskun", 
                                  "Békés", 
                                  "Csongrád"],
    "Dél-Dunántúl régió"       : ["Baranya",
                                  "Somogy",
                                  "Tolna"],
    "Közép-Dunántúl régió"     : ["Fejér",
                                  "Komárom-Esztergom",
                                  "Veszprém"],
    "Közép-Magyarország régió" : ["Budapest", 
                                  "Pest"],
    "Nyugat-Dunántúl régió"    : ["Győr-Moson-Sopron",
                                  "Vas",
                                  "Zala"],
    "Észak-Alföld régió"       : ["Hajdú-Bihar",
                                  "Jász-Nagykun-Szolnok",
                                  "Szabolcs-Szatmár-Bereg"],
    "Észak-Magyarország régió" : ["Borsod-Abaúj-Zemplén",
                                  "Heves",
                                  "Nógrád"],
  };

  mapCounties: Record<string, string> = {
    "Bács-Kiskun"            : "path10",
    "Csongrád"               : "path12",
    "Győr-Moson-Sopron"      : "polygon16",
    "Heves"                  : "polygon18",
    "Komárom-Esztergom"      : "polygon20",
    "Hajdú-Bihar"            : "polygon22",
    "Jász-Nagykun-Szolnok"   : "polygon24",
    "Veszprém"               : "polygon26",
    "Vas"                    : "polygon28",
    "Budapest"               : "polygon30",
    "Fejér"                  : "polygon32",
    "Békés"                  : "polygon34",
    "Somogy"                 : "polygon36",
    "Zala"                   : "polygon38",
    "Tolna"                  : "polygon40",
    "Baranya"                : "polygon42",
    "Nógrád"                 : "polygon44",
    "Pest"                   : "path46",
    "Borsod-Abaúj-Zemplén"   : "polygon48",
    "Szabolcs-Szatmár-Bereg" : "polygon50"
  };

  constructor(private odata: OdataService) { }

  ngOnInit() { 
    this.odata
      .getRegionSubject()
      .subscribe(name => {
        if (this.regionName != null) {
          this.deactivateRegion(this.regionName);
        }
        this.regionName = name;
        this.activateRegion(name);
      });
    this.odata
      .getCountySubject()
      .subscribe(name => {
        if (this.countyName != null) {
          this.deactivateRegion(this.regionName);
          this.activateCounty(name);
        }
        this.countyName = name;
      });
  } 

  activateCounty(name: string): void {
    let e = this.mapCounties[name];
    document.getElementById(e).classList.add("active");
  }

  deactivateCounty(name: string): void {
    let e = this.mapCounties[name];
    document.getElementById(e).classList.remove("active");
  }

  activateRegion(name: string): void {
    let arr = this.mapRegions[name];
    for (let i = 0; i < arr.length; i++) {
      this.activateCounty(arr[i]);
    }
  }

  deactivateRegion(name: string): void {
    let arr = this.mapRegions[name];
    for (let i = 0; i < arr.length; i++) {
      this.deactivateCounty(arr[i]);
    }
  }
}
