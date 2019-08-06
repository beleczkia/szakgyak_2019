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
                                  "Nógrád"]
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
          this.deactivateCounty(this.countyName);
          this.deactivateRegion(this.regionName);
        }
        this.regionName = name;
        this.activateRegion(name);
      });
    this.odata
      .getCountySubject()
      .subscribe(name => {
        if (this.countyName != null) {
          this.deactivateCounty(this.countyName);
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

  // countyClicked(event): void {
  //   // ----------------------------
  //   // a) mapRegionsből kikeresem, hogy a kattintott megye hol van
  //   //    ezek után meghívom a table regionClicked metódusát
  //   //        ekkor kilistázza a megyéket
  //   //    ezek után meg kell hívni a countyClicked metódust is,
  //   //    hogy láthassuk a megyében szereplő településeket
  //   // ----------------------------
  //   // b) illetve beszínezett megyéknek is más fill hover css kell
  //   // ----------------------------
  //   
  //   // TODO: átnevezni
  //   // erre semmi szükség, a table-t kell feliratkoztatni a névváltoztatásokra
  //   // let regionSearch = function (): string {
  //   //   for (let region in this.mapRegions) {
  //   //     for (let i = 0; i < region.length; i++) {
  //   //       if (region[i] === this.countyName) {
  //   //         return region;
  //   //       }
  //   //     }
  //   //   } 
  //   // }

  //   let polygon: string = event.target.attributes.id.nodeValue;

  //   for (let county in this.mapCounties) {
  //     if (this.mapCounties[county] === polygon) {
  //       this.deactivateRegion(this.regionName);
  //       this.deactivateCounty(this.countyName);

  //       // this.regionName = regionSearch();
  //       for (let region in this.mapRegions) {
  //         // console.log("CIKLUS REGION VALTOZO: " + region);
  //         for (let i = 0; i < region.length; i++) {
  //           // console.log("ELAGAZAS FELTETELBEN: " + this.mapRegions[region]);
  //           if (this.mapRegions[region][i] === county) {
  //             // console.log("ELAGAZASBA BEMENT: " + county);
  //             this.regionName = region;
  //             // console.log("ELAGAZASBAN ERTEKET ADOTT: " + this.regionName);
  //           }
  //         }
  //       } 
  //       this.odata.setRegionName(this.regionName);
  //       console.log("REGIO :" + this.regionName)

  //       this.countyName = county;
  //       this.odata.setCountyName(county);
  //       console.log("MEGYE :" + this.countyName)

  //       this.activateCounty(county);

  //       return;
  //     }
  //   }
  // }
}
